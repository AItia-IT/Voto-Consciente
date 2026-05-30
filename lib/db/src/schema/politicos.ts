import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const esferaEnum = pgEnum("esfera", ["federal", "estadual", "municipal"]);

export const politicos = pgTable("politicos", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  nomeUrna: text("nome_urna").notNull(),
  partido: text("partido").notNull(),
  esfera: esferaEnum("esfera").notNull(),
  localidade: text("localidade").notNull(),
  cargo: text("cargo").notNull(),
  foto: text("foto"),
  urlCamara: text("url_camara"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertPoliticoSchema = createInsertSchema(politicos).omit({
  id: true,
  createdAt: true,
});

export type Politico = typeof politicos.$inferSelect;
export type InsertPolitico = z.infer<typeof insertPoliticoSchema>;
