import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, politicos, promessas, realizacoes } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { esfera, localidade } = req.query as { esfera?: string; localidade?: string };

    const conditions = [];
    if (esfera && ["federal", "estadual", "municipal"].includes(esfera)) {
      conditions.push(eq(politicos.esfera, esfera as "federal" | "estadual" | "municipal"));
    }
    if (localidade) {
      conditions.push(eq(politicos.localidade, localidade));
    }

    const list =
      conditions.length > 0
        ? await db.select().from(politicos).where(and(...conditions)).orderBy(politicos.nome)
        : await db.select().from(politicos).orderBy(politicos.nome);

    res.json(list);
  } catch (err) {
    req.log?.error({ err }, "Error listing politicos");
    res.status(500).json({ error: "Erro ao buscar políticos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const [politico] = await db.select().from(politicos).where(eq(politicos.id, id));
    if (!politico) {
      res.status(404).json({ error: "Político não encontrado" });
      return;
    }

    const [promessasList, realizacoesList] = await Promise.all([
      db.select().from(promessas).where(eq(promessas.politicoId, id)).orderBy(promessas.categoria),
      db.select().from(realizacoes).where(eq(realizacoes.politicoId, id)).orderBy(realizacoes.ano),
    ]);

    res.json({ ...politico, promessas: promessasList, realizacoes: realizacoesList });
  } catch (err) {
    req.log?.error({ err }, "Error getting politico");
    res.status(500).json({ error: "Erro ao buscar político" });
  }
});

export default router;
