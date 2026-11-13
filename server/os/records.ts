import { STAGE_PROBABILITY, type Deal, type DealInput } from "../../shared/os";
import type { D1Database } from "../db/d1";
import { randomHex } from "../security/crypto";
import { HttpError } from "../http";

/** 24 random bytes as hex: 48 characters, unguessable. Rotated from the Clients tab. */
export const newPortalToken = () => randomHex(24);
export const now = () => new Date().toISOString();

export async function assertClientExists(db: D1Database, clientId: number): Promise<void> {
  const row = await db.prepare("SELECT 1 AS ok FROM clients WHERE id = ?").bind(clientId).first();
  if (!row) throw new HttpError(400, "Choose an existing client");
}

/** Probability follows the stage unless set explicitly; it is kept when the stage does not change. */
export function buildDeal(input: DealInput, previous?: Deal): Omit<Deal, "id"> {
  const stageChanged = previous && previous.stage !== input.stage;
  const probability = input.probability ?? (stageChanged || !previous ? STAGE_PROBABILITY[input.stage] : previous.probability);
  const stamp = now();
  return { ...input, probability, createdAt: previous?.createdAt ?? stamp, updatedAt: stamp };
}

export function required<T>(row: T | null, message = "Not found"): T {
  if (!row) throw new HttpError(404, message);
  return row;
}
