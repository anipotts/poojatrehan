import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// Storage interface for database operations
export interface IStorage {
  // Admin operations
  getAdminById(id: string): Promise<schema.Admin | undefined>;
  getAdminByUsername(username: string): Promise<schema.Admin | undefined>;
  createAdmin(admin: schema.InsertAdmin): Promise<schema.Admin>;
}

class PostgresStorage implements IStorage {
  async getAdminById(id: string): Promise<schema.Admin | undefined> {
    const [admin] = await db
      .select()
      .from(schema.admins)
      .where(eq(schema.admins.id, id))
      .limit(1);
    return admin;
  }

  async getAdminByUsername(username: string): Promise<schema.Admin | undefined> {
    const [admin] = await db
      .select()
      .from(schema.admins)
      .where(eq(schema.admins.username, username))
      .limit(1);
    return admin;
  }

  async createAdmin(insertAdmin: schema.InsertAdmin): Promise<schema.Admin> {
    const [admin] = await db
      .insert(schema.admins)
      .values(insertAdmin)
      .returning();
    return admin;
  }
}

export const storage = new PostgresStorage();
