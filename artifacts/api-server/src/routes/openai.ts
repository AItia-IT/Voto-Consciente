import { Router } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { db, conversations, messages, politicos, promessas, realizacoes } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const BASE_SYSTEM_PROMPT = `Você é a Sônia, uma assistente educativa virtual da plataforma "Voto Consciente". 
Seu papel é ajudar cidadãos brasileiros — principalmente pessoas idosas — a entender melhor:
- Como identificar notícias falsas e desinformação
- Como funciona a democracia, os poderes e os cargos eleitorais
- Direitos e deveres dos cidadãos
- Como verificar fontes antes de compartilhar conteúdo

REGRAS FUNDAMENTAIS (nunca viole):
- Nunca apoie, critique ou recomende partidos políticos, candidatos ou ideologias
- Nunca faça recomendações de voto
- Ao analisar promessas e realizações de políticos, seja sempre factual e apartidária
- Se alguém perguntar em qual candidato votar, diga que a escolha é pessoal e incentive a pessoa a comparar propostas

Use linguagem muito simples, acolhedora e sem jargões. Seja paciente e encorajador. Use exemplos do cotidiano.
Mantenha respostas curtas e diretas — máximo 3 parágrafos.`;

async function buildSystemPrompt(userMessage: string): Promise<string> {
  try {
    const allPoliticos = await db.select().from(politicos);
    if (allPoliticos.length === 0) return BASE_SYSTEM_PROMPT;

    const mentioned = allPoliticos.filter(p => {
      const msg = userMessage.toLowerCase();
      return (
        msg.includes(p.nomeUrna.toLowerCase()) ||
        msg.includes(p.nome.toLowerCase()) ||
        p.nomeUrna.split(" ").some(word => word.length > 4 && msg.includes(word.toLowerCase()))
      );
    });

    if (mentioned.length === 0) return BASE_SYSTEM_PROMPT;

    const contextos = await Promise.all(
      mentioned.map(async (p) => {
        const [prom, real] = await Promise.all([
          db.select().from(promessas).where(eq(promessas.politicoId, p.id)),
          db.select().from(realizacoes).where(eq(realizacoes.politicoId, p.id)),
        ]);

        const promStr = prom.map(pr => `  - [${pr.categoria}] ${pr.descricao}`).join("\n");
        const realStr = real.map(r => `  - [${r.status}] ${r.titulo}: ${r.descricao}`).join("\n");

        return `## ${p.nome} (${p.partido} — ${p.cargo} por ${p.localidade})
Promessas de campanha:
${promStr || "  (nenhuma registrada)"}
Projetos de lei / Realizações:
${realStr || "  (nenhuma registrada)"}`;
      })
    );

    return `${BASE_SYSTEM_PROMPT}

---
CONTEXTO FACTUAL DOS POLÍTICOS MENCIONADOS (use para análise apartidária e factual):
${contextos.join("\n\n")}

Ao responder, compare objetivamente as promessas com as realizações. Não julgue o político como bom ou mau — apenas aponte o que foi prometido e o que foi feito, baseando-se nos dados acima.`;
  } catch {
    return BASE_SYSTEM_PROMPT;
  }
}

router.get("/conversations", async (req, res) => {
  try {
    const list = await db.select().from(conversations).orderBy(conversations.createdAt);
    res.json(list);
  } catch (err) {
    req.log?.error({ err }, "Error listing conversations");
    res.status(500).json({ error: "Erro ao buscar conversas" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ error: "Título obrigatório" });
      return;
    }
    const [conv] = await db.insert(conversations).values({ title }).returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log?.error({ err }, "Error creating conversation");
    res.status(500).json({ error: "Erro ao criar conversa" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) {
      res.status(404).json({ error: "Conversa não encontrada" });
      return;
    }
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
    res.json({ ...conv, messages: msgs });
  } catch (err) {
    req.log?.error({ err }, "Error getting conversation");
    res.status(500).json({ error: "Erro ao buscar conversa" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) {
      res.status(404).json({ error: "Conversa não encontrada" });
      return;
    }
    await db.delete(conversations).where(eq(conversations.id, id));
    res.status(204).send();
  } catch (err) {
    req.log?.error({ err }, "Error deleting conversation");
    res.status(500).json({ error: "Erro ao deletar conversa" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
    res.json(msgs);
  } catch (err) {
    req.log?.error({ err }, "Error listing messages");
    res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id);
  const { content } = req.body;

  if (!content?.trim()) {
    res.status(400).json({ error: "Mensagem não pode estar vazia" });
    return;
  }

  try {
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) {
      res.status(404).json({ error: "Conversa não encontrada" });
      return;
    }

    await db.insert(messages).values({ conversationId: id, role: "user", content });

    const history = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);

    const systemPrompt = await buildSystemPrompt(content);

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      max_completion_tokens: 512,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    await db.insert(messages).values({ conversationId: id, role: "assistant", content: fullResponse });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log?.error({ err }, "Error sending message");
    if (!res.headersSent) {
      res.status(500).json({ error: "Erro ao enviar mensagem" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Erro ao processar resposta" })}\n\n`);
      res.end();
    }
  }
});

export default router;
