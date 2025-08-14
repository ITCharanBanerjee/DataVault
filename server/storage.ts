import { users, snippets, snippetLikes, type User, type InsertUser, type Snippet, type InsertSnippet, type SnippetWithAuthor } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc, and, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db.js";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSnippet(snippet: InsertSnippet & { authorId: string }): Promise<Snippet>;
  getSnippet(id: string): Promise<SnippetWithAuthor | undefined>;
  getSnippets(limit?: number, offset?: number): Promise<SnippetWithAuthor[]>;
  getSnippetsByUser(userId: string): Promise<SnippetWithAuthor[]>;
  getPopularSnippets(limit?: number): Promise<SnippetWithAuthor[]>;
  updateSnippet(id: string, updates: Partial<InsertSnippet>): Promise<Snippet | undefined>;
  deleteSnippet(id: string): Promise<boolean>;
  
  likeSnippet(snippetId: string, userId: string): Promise<boolean>;
  unlikeSnippet(snippetId: string, userId: string): Promise<boolean>;
  isSnippetLiked(snippetId: string, userId: string): Promise<boolean>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createSnippet(snippet: InsertSnippet & { authorId: string }): Promise<Snippet> {
    const [newSnippet] = await db
      .insert(snippets)
      .values(snippet)
      .returning();
    return newSnippet;
  }

  async getSnippet(id: string): Promise<SnippetWithAuthor | undefined> {
    const [snippet] = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        code: snippets.code,
        language: snippets.language,
        authorId: snippets.authorId,
        isPublic: snippets.isPublic,
        likes: snippets.likes,
        createdAt: snippets.createdAt,
        updatedAt: snippets.updatedAt,
        author: users,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.authorId, users.id))
      .where(eq(snippets.id, id));
    
    return snippet || undefined;
  }

  async getSnippets(limit = 20, offset = 0): Promise<SnippetWithAuthor[]> {
    return await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        code: snippets.code,
        language: snippets.language,
        authorId: snippets.authorId,
        isPublic: snippets.isPublic,
        likes: snippets.likes,
        createdAt: snippets.createdAt,
        updatedAt: snippets.updatedAt,
        author: users,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.authorId, users.id))
      .where(eq(snippets.isPublic, true))
      .orderBy(desc(snippets.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getSnippetsByUser(userId: string): Promise<SnippetWithAuthor[]> {
    return await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        code: snippets.code,
        language: snippets.language,
        authorId: snippets.authorId,
        isPublic: snippets.isPublic,
        likes: snippets.likes,
        createdAt: snippets.createdAt,
        updatedAt: snippets.updatedAt,
        author: users,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.authorId, users.id))
      .where(eq(snippets.authorId, userId))
      .orderBy(desc(snippets.createdAt));
  }

  async getPopularSnippets(limit = 10): Promise<SnippetWithAuthor[]> {
    return await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        code: snippets.code,
        language: snippets.language,
        authorId: snippets.authorId,
        isPublic: snippets.isPublic,
        likes: snippets.likes,
        createdAt: snippets.createdAt,
        updatedAt: snippets.updatedAt,
        author: users,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.authorId, users.id))
      .where(eq(snippets.isPublic, true))
      .orderBy(desc(snippets.likes), desc(snippets.createdAt))
      .limit(limit);
  }

  async updateSnippet(id: string, updates: Partial<InsertSnippet>): Promise<Snippet | undefined> {
    const [snippet] = await db
      .update(snippets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(snippets.id, id))
      .returning();
    return snippet || undefined;
  }

  async deleteSnippet(id: string): Promise<boolean> {
    const result = await db.delete(snippets).where(eq(snippets.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async likeSnippet(snippetId: string, userId: string): Promise<boolean> {
    try {
      await db.transaction(async (tx) => {
        // Insert like
        await tx.insert(snippetLikes).values({ snippetId, userId });
        // Increment likes count
        await tx
          .update(snippets)
          .set({ likes: sql`${snippets.likes} + 1` })
          .where(eq(snippets.id, snippetId));
      });
      return true;
    } catch {
      return false;
    }
  }

  async unlikeSnippet(snippetId: string, userId: string): Promise<boolean> {
    try {
      await db.transaction(async (tx) => {
        // Remove like
        await tx
          .delete(snippetLikes)
          .where(and(eq(snippetLikes.snippetId, snippetId), eq(snippetLikes.userId, userId)));
        // Decrement likes count
        await tx
          .update(snippets)
          .set({ likes: sql`${snippets.likes} - 1` })
          .where(eq(snippets.id, snippetId));
      });
      return true;
    } catch {
      return false;
    }
  }

  async isSnippetLiked(snippetId: string, userId: string): Promise<boolean> {
    const [like] = await db
      .select()
      .from(snippetLikes)
      .where(and(eq(snippetLikes.snippetId, snippetId), eq(snippetLikes.userId, userId)));
    return !!like;
  }
}

export const storage = new DatabaseStorage();
