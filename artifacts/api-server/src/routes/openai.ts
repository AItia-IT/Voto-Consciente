import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, conversations, messages } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const SYSTEM_PROMPT = `Você é a Sônia, uma assistente educativa virtual da plataforma "Voto Consciente". 
Seu papel é ajudar cidadãos brasileiros — principalmente pessoas idosas — a entender melhor:
- Como identificar notícias falsas e desinformação
- Como funciona a democracia, os poderes e os cargos eleitorais
- Direitos e deveres dos cidadãos
- Como verificar fontes antes de compartilhar conteúdo

REGRAS FUNDAMENTAIS (nunca viole):
- Nunca apoie, critique ou recomende partidos políticos, candidatos ou ideologias
- Nunca faça recomendações de voto
- Nunca opine sobre figuras políticas específicas
- Se alguém perguntar em qual candidato votar, diga que a escolha é pessoal e incentive a pessoa a comparar propostas

Use linguagem muito simples, acolhedora e sem jargões. Seja paciente e encorajador. Use exemplos do cotidiano.
Mantenha respostas curtas e diretas — máximo 3 parágrafos.`;

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

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
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
      model: "gpt-5.4",
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
