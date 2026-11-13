/** A SQL fragment with its own bound parameters, inlined where a plain `?` value would go. */
export class RawSql {
  constructor(
    readonly text: string,
    readonly params: readonly unknown[] = [],
  ) {}
}

export const raw = (text: string, params: readonly unknown[] = []) => new RawSql(text, params);

/** Concatenates literal strings and SQL fragments with `||`, binding the literals as parameters. */
export function concat(...parts: Array<string | RawSql>): RawSql {
  const text = parts.map((part) => (part instanceof RawSql ? `(${part.text})` : "?")).join(" || ");
  const params = parts.flatMap((part) => (part instanceof RawSql ? part.params : [part]));
  return raw(text, params);
}

/** Placeholder text and parameters for one bound value (plain value or RawSql fragment). */
export function placeholder(value: unknown): { text: string; params: unknown[] } {
  if (value instanceof RawSql) return { text: `(${value.text})`, params: [...value.params] };
  return { text: "?", params: [value] };
}
