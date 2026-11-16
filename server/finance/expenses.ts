import { Hono } from "hono";
import { expenseInput, type Expense } from "../../shared/crm";
import type { AppEnv } from "../env";
import { expenses } from "../db/tables";
import { HttpError, parseId, readJson } from "../http";
import { logActivity } from "../os/activity";

/** Business expenses. Mounted behind requireUser + the "expenses" area. */
export const expenseRoutes = new Hono<AppEnv>();

expenseRoutes.get("/api/os/expenses", async (c) => {
  const rows = await expenses.all(c.env.DB);
  return c.json(rows.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id));
});

expenseRoutes.post("/api/os/expenses", async (c) => {
  const db = c.env.DB;
  const input = expenseInput.parse(await readJson(c));
  const stamp = new Date().toISOString();
  const row: Omit<Expense, "id"> = { ...input, createdAt: stamp, updatedAt: stamp };
  const label = `Expense: ₹${input.amountInr.toLocaleString("en-IN")} ${input.category}${input.vendor ? ` (${input.vendor})` : ""}`;
  const [inserted] = await db.batch([expenses.insert(db, row), ...logActivity(db, "expense", label)]);
  return c.json(expenses.firstRow(inserted), 201);
});

expenseRoutes.patch("/api/os/expenses/:id", async (c) => {
  const db = c.env.DB;
  const id = parseId(c);
  const previous = await expenses.byId(db, id);
  if (!previous) throw new HttpError(404, "Expense not found");
  const input = expenseInput.parse({ ...previous, ...(await readJson(c)) });
  return c.json(expenses.firstRow(await expenses.update(db, id, { ...input, updatedAt: new Date().toISOString() }).run()));
});

expenseRoutes.delete("/api/os/expenses/:id", async (c) => {
  const result = await expenses.remove(c.env.DB, parseId(c)).run();
  if (result.meta.changes === 0) throw new HttpError(404, "Expense not found");
  return c.body(null, 204);
});
