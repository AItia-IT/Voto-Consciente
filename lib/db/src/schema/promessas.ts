import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { politicos } from "./politicos";

export const promessas = pgTable("promessas", {
  id: serial("id").primaryKey(),
  politicoId: integer("politico_id")
    .notNull()
    .references(() => politicos.id, { onDelete: "cascade" }),
  categoria: text("categoria").notNull(),
  descricao: text("descricao").notNull(),
  fonte: text("fonte"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertPromessaSchema = createInsertSchema(promessas).omit({
  id: true,
  createdAt: true,
});

export type Promessa = typeof promessas.$inferSelect;
export type InsertPromessa = z.infer<typeof insertPromessaSchema>;
