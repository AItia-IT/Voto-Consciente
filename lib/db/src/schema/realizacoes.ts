import { pgTable, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { politicos } from "./politicos";

export const statusRealizacaoEnum = pgEnum("status_realizacao", [
  "Aprovado",
  "Em tramitação",
  "Arquivado",
]);

export const realizacoes = pgTable("realizacoes", {
  id: serial("id").primaryKey(),
  politicoId: integer("politico_id")
    .notNull()
    .references(() => politicos.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  status: statusRealizacaoEnum("status").notNull(),
  urlOficial: text("url_oficial"),
  ano: text("ano"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertRealizacaoSchema = createInsertSchema(realizacoes).omit({
  id: true,
  createdAt: true,
});

export type Realizacao = typeof realizacoes.$inferSelect;
export type InsertRealizacao = z.infer<typeof insertRealizacaoSchema>;
