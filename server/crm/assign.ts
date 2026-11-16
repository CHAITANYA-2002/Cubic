import { assignmentInput } from "../../shared/team";
import type { D1Database } from "../db/d1";
import { loadDoc } from "../docs";

export type Candidate = { id: number; load: number };

/** Least-busy candidate; ties go to whoever was added first. Pure, so it is unit-tested. */
export function pickLeastBusy(candidates: Candidate[]): number | null {
  const sorted = [...candidates].sort((a, b) => a.load - b.load || a.id - b.id);
  return sorted[0]?.id ?? null;
}

/**
 * Who a new lead goes to: the active owner/admin/sales person who takes leads and has the fewest
 * open leads plus open deals. Null when auto-assign is off or nobody takes leads.
 */
export async function chooseAssignee(db: D1Database): Promise<number | null> {
  const settings = await loadDoc(db, "assignment", assignmentInput);
  if (!settings.autoAssign) return null;
  const { results } = await db
    .prepare(
      `SELECT u.id AS id,
         (SELECT COUNT(*) FROM leads l WHERE l.assigned_to = u.id AND l.status IN ('New', 'Contacted'))
         + (SELECT COUNT(*) FROM deals d WHERE d.assigned_to = u.id AND d.stage NOT IN ('Won', 'Lost')) AS load
       FROM users u
       WHERE u.active = 1 AND u.takes_leads = 1 AND u.role IN ('owner', 'admin', 'sales')`,
    )
    .all<Candidate>();
  return pickLeastBusy(results.map((row) => ({ id: Number(row.id), load: Number(row.load) })));
}
