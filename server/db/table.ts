import type { D1Database, D1PreparedStatement, D1Result } from "./d1";
import { placeholder, RawSql } from "./sql";

/** How a field is stored: JSON for nested lists, 0/1 for booleans, nullable integers for references. */
export type Kind = "text" | "int" | "real" | "bool" | "json" | "ref";
export type Field<T> = readonly [key: keyof T & string, column: string, kind: Kind];

/** Any field may be written as a SQL fragment, e.g. a subquery or a counter-derived number. */
export type Writable<T> = { [K in keyof T]: T[K] | RawSql };

function encode(value: unknown, kind: Kind): unknown {
  if (value instanceof RawSql) return value;
  switch (kind) {
    case "json":
      return JSON.stringify(value ?? []);
    case "bool":
      return value ? 1 : 0;
    case "ref":
      return value ?? null;
    case "int":
    case "real":
      return value ?? 0;
    default:
      return value ?? "";
  }
}

function decode(value: unknown, kind: Kind): unknown {
  switch (kind) {
    case "json":
      return JSON.parse(typeof value === "string" && value ? value : "[]");
    case "bool":
      return Boolean(value);
    case "ref":
      return value === null || value === undefined ? null : Number(value);
    case "int":
    case "real":
      return Number(value ?? 0);
    default:
      return value === null || value === undefined ? "" : String(value);
  }
}

export type Table<T extends { id: number }> = ReturnType<typeof defineTable<T>>;

/** Maps one D1 table to a camelCase row type. Every list is newest first, like the old document. */
export function defineTable<T extends { id: number }>(name: string, fields: ReadonlyArray<Field<T>>) {
  const writable = fields.filter(([key]) => key !== "id");

  const fromRow = (row: Record<string, unknown>): T =>
    Object.fromEntries(fields.map(([key, column, kind]) => [key, decode(row[column], kind)])) as T;

  const firstRow = (result: D1Result | undefined): T | null => {
    const row = result?.results[0];
    return row ? fromRow(row) : null;
  };

  return {
    name,
    fromRow,
    firstRow,

    insert(db: D1Database, value: Writable<Omit<T, "id">>): D1PreparedStatement {
      const record = value as Record<string, unknown>;
      const parts = writable.map(([key, , kind]) => placeholder(encode(record[key], kind)));
      const sql = `INSERT INTO ${name} (${writable.map(([, column]) => column).join(", ")}) VALUES (${parts.map((part) => part.text).join(", ")}) RETURNING *`;
      return db.prepare(sql).bind(...parts.flatMap((part) => part.params));
    },

    /** Updates only the fields present in `value`. */
    update(db: D1Database, id: number, value: Partial<Writable<Omit<T, "id">>>): D1PreparedStatement {
      const record = value as Record<string, unknown>;
      const present = writable.filter(([key]) => record[key] !== undefined);
      const parts = present.map(([key, column, kind]) => ({ column, ...placeholder(encode(record[key], kind)) }));
      const assignments = parts.map((part) => `${part.column} = ${part.text}`).join(", ");
      const sql = `UPDATE ${name} SET ${assignments} WHERE id = ? RETURNING *`;
      return db.prepare(sql).bind(...parts.flatMap((part) => part.params), id);
    },

    async all(db: D1Database, where = "", params: unknown[] = []): Promise<T[]> {
      const sql = `SELECT * FROM ${name}${where ? ` WHERE ${where}` : ""} ORDER BY id DESC`;
      const { results } = await db.prepare(sql).bind(...params).all();
      return results.map(fromRow);
    },

    async byId(db: D1Database, id: number): Promise<T | null> {
      const row = await db.prepare(`SELECT * FROM ${name} WHERE id = ?`).bind(id).first();
      return row ? fromRow(row) : null;
    },

    remove(db: D1Database, id: number): D1PreparedStatement {
      return db.prepare(`DELETE FROM ${name} WHERE id = ?`).bind(id);
    },
  };
}
