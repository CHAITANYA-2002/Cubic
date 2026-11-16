import { DEFAULT_AVAILABILITY } from "../../shared/team";
import type { D1Database } from "../db/d1";
import { users, type UserRow } from "../db/tables";

/** The owner's account row, created on the first ADMIN_PASSWORD sign-in. Safe under concurrent sign-ins. */
export async function ensureOwner(db: D1Database): Promise<UserRow> {
  const existing = users.firstRow(await db.prepare("SELECT * FROM users WHERE role = 'owner'").all());
  if (existing) return existing;
  const stamp = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO users (name, email, role, password_hash, active, takes_calls, takes_leads, availability, token_version, created_at, updated_at)
       VALUES ('Chaitanya Khurana', '', 'owner', '', 1, 1, 1, ?, 1, ?, ?) ON CONFLICT DO NOTHING`,
    )
    .bind(JSON.stringify(DEFAULT_AVAILABILITY), stamp, stamp)
    .run();
  const created = users.firstRow(await db.prepare("SELECT * FROM users WHERE role = 'owner'").all());
  if (!created) throw new Error("Owner account could not be created");
  return created;
}
