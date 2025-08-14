import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const snippets = pgTable("snippets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  code: text("code").notNull(),
  language: text("language").notNull(),
  authorId: varchar("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(true).notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const snippetLikes = pgTable("snippet_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  snippetId: varchar("snippet_id").notNull().references(() => snippets.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  snippets: many(snippets),
  likes: many(snippetLikes),
}));

export const snippetsRelations = relations(snippets, ({ one, many }) => ({
  author: one(users, {
    fields: [snippets.authorId],
    references: [users.id],
  }),
  likes: many(snippetLikes),
}));

export const snippetLikesRelations = relations(snippetLikes, ({ one }) => ({
  snippet: one(snippets, {
    fields: [snippetLikes.snippetId],
    references: [snippets.id],
  }),
  user: one(users, {
    fields: [snippetLikes.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertSnippetSchema = createInsertSchema(snippets).omit({
  id: true,
  authorId: true,
  likes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSnippet = z.infer<typeof insertSnippetSchema>;
export type Snippet = typeof snippets.$inferSelect;
export type SnippetWithAuthor = Snippet & { author: User };
