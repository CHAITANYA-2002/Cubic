import type { D1Database, D1PreparedStatement } from "../db/d1";
import type { RawSql } from "../db/sql";
import { activity } from "../db/tables";

const KEEP = 500;

/** Insert an activity entry and trim the log to the newest 500, in the caller's batch. */
export function logActivity(db: D1Database, kind: string, text: string | RawSql): D1PreparedStatement[] {
  return [
    activity.insert(db, { at: new Date().toISOString(), kind, text }),
    db.prepare(`DELETE FROM activity WHERE id <= (SELECT id FROM activity ORDER BY id DESC LIMIT 1 OFFSET ${KEEP})`),
  ];
}
