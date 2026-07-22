import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// The site runs fine without a database (contact submissions fall back to
// in-memory storage + CSV export). Only wire up Postgres when a DATABASE_URL
// is actually provided, so local dev doesn't require provisioning a DB.
let pool: pg.Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}

export { pool, db };
