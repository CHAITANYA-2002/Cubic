import type { z } from "zod";
import type { D1Database } from "./db/d1";

/** Named JSON settings documents in app_docs. A missing or invalid document falls back to defaults. */
export async function loadDoc<S extends z.ZodTypeAny>(db: D1Database, key: string, schema: S): Promise<z.infer<S>> {
  const row = await db.prepare("SELECT data FROM app_docs WHERE key = ?").bind(key).first<{ data: string }>();
  let stored: unknown = {};
  try {
    stored = row ? JSON.parse(row.data) : {};
  } catch {
    stored = {};
  }
  const parsed = schema.safeParse(stored);
  return parsed.success ? parsed.data : schema.parse({});
}

export async function saveDoc(db: D1Database, key: string, data: unknown): Promise<void> {
  await db
    .prepare("INSERT INTO app_docs (key, data, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET data = ?2, updated_at = ?3")
    .bind(key, JSON.stringify(data), new Date().toISOString())
    .run();
}
