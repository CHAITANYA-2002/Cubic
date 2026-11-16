import { seesEverything } from "../../shared/team";
import type { UserRow } from "../db/tables";
import { HttpError } from "../http";

/** Owners and admins see everything; others see their own records and unassigned ones. */
export const scopeWhere = (user: UserRow, column = "assigned_to"): { where: string; params: unknown[] } =>
  seesEverything(user.role) ? { where: "", params: [] } : { where: `(${column} IS NULL OR ${column} = ?)`, params: [user.id] };

export function assertMayTouch(user: UserRow, assignedTo: number | null | undefined): void {
  if (seesEverything(user.role)) return;
  if (assignedTo && assignedTo !== user.id) throw new HttpError(403, "This record belongs to someone else.");
}

/** Only owners and admins may hand a record to someone else; others may take it themselves. */
export function allowedAssignee(user: UserRow, requested: number | null | undefined, current: number | null): number | null {
  if (requested === undefined) return current;
  if (seesEverything(user.role)) return requested;
  if (requested === null || requested === user.id) return requested;
  throw new HttpError(403, "Only an owner or admin can assign records to someone else.");
}

export function assertAdmin(user: UserRow): void {
  if (!seesEverything(user.role)) throw new HttpError(403, "Only an owner or admin can do this.");
}
