import { describe, expect, it } from "vitest";
import { can, seesEverything } from "../../shared/team";
import { pickLeastBusy } from "../crm/assign";
import { hashPassword, verifyPassword } from "./password";
import { createSession, verifySession } from "./session";

const SECRET = "x".repeat(40);

describe("passwords", () => {
  it("verifies the right password and rejects others", async () => {
    const stored = await hashPassword("correct horse battery");
    expect(stored.startsWith("pbkdf2$100000$")).toBe(true);
    expect(await verifyPassword("correct horse battery", stored)).toBe(true);
    expect(await verifyPassword("wrong", stored)).toBe(false);
  });
  it("never accepts a malformed or empty hash", async () => {
    expect(await verifyPassword("anything", "")).toBe(false);
    expect(await verifyPassword("anything", "pbkdf2$999999999$AA$AA")).toBe(false);
  });
});

describe("sessions", () => {
  it("round-trips the user and token version", async () => {
    const { value } = await createSession(SECRET, 3, 2, 1_000);
    expect(await verifySession(SECRET, value, 2_000)).toEqual({ userId: 3, version: 2, expiresAt: 1_000 + 12 * 3600 * 1000 });
  });
  it("rejects tampering, expiry, other secrets and the old v1 format", async () => {
    const { value } = await createSession(SECRET, 3, 2, 1_000);
    const tampered = value.replace(".3.2.", ".1.2.");
    expect(await verifySession(SECRET, tampered, 2_000)).toBeNull();
    expect(await verifySession(SECRET, value, 1_000 + 13 * 3600 * 1000)).toBeNull();
    expect(await verifySession("y".repeat(40), value, 2_000)).toBeNull();
    expect(await verifySession(SECRET, "v1.99999999999999.abc.def", 2_000)).toBeNull();
  });
});

describe("roles", () => {
  it("gives sales the sales areas only", () => {
    expect(can("sales", "leads")).toBe(true);
    expect(can("sales", "invoices")).toBe(false);
    expect(can("sales", "team")).toBe(false);
    expect(seesEverything("sales")).toBe(false);
  });
  it("keeps team management with the owner", () => {
    expect(can("owner", "team")).toBe(true);
    expect(can("admin", "team")).toBe(false);
    expect(can("admin", "invoices")).toBe(true);
  });
});

describe("lead routing", () => {
  it("picks the least busy, then the earliest added", () => {
    expect(pickLeastBusy([{ id: 4, load: 3 }, { id: 2, load: 1 }, { id: 9, load: 1 }])).toBe(2);
    expect(pickLeastBusy([])).toBeNull();
  });
});
