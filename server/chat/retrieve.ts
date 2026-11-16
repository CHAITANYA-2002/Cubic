import type { Chunk } from "./knowledge";

const STOP = new Set(
  "the and for are you your our with what how does can will this that from have has was were which who whom why when where about into than then them they their there just also any all but not yes may might should would could please tell want need know like make get give much many some more most very really".split(" "),
);

export const tokens = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[!-/:-@[-`{-~ -¿ -⁯]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOP.has(word));

/**
 * Picks the chunks most relevant to the question: core chunks (contact, prices) always, then the
 * best keyword matches weighted by rarity, within a character budget. Questions in other scripts
 * may match nothing; they still get the core chunks plus the FAQ and service overviews.
 */
export function retrieve(corpus: Chunk[], query: string, budget = 9000): Chunk[] {
  const queryTerms = Array.from(new Set(tokens(query)));
  const docTerms = corpus.map((chunk) => new Set(tokens(`${chunk.title} ${chunk.text}`)));
  const idf = (term: string) => Math.log(1 + corpus.length / (1 + docTerms.filter((terms) => terms.has(term)).length));
  const scored = corpus
    .map((chunk, index) => ({ chunk, score: queryTerms.reduce((sum, term) => sum + (docTerms[index].has(term) ? idf(term) : 0), 0) }))
    .filter(({ chunk }) => !chunk.core)
    .sort((a, b) => b.score - a.score);

  const anyMatch = (scored[0]?.score ?? 0) > 0;
  const ranked = anyMatch ? scored.filter((item) => item.score > 0) : scored.filter(({ chunk }) => /^(faq-|service-|about|kb-)/.test(chunk.id));
  const picked: Chunk[] = corpus.filter((chunk) => chunk.core);
  let used = picked.reduce((sum, chunk) => sum + chunk.text.length, 0);
  for (const { chunk } of ranked) {
    if (used + chunk.text.length > budget) continue;
    picked.push(chunk);
    used += chunk.text.length;
  }
  return picked;
}

/** Visitor intent that deserves the booking and contact buttons. */
export const wantsToTalk = (text: string) =>
  /\b(call|book|meeting|quote|proposal|hire|start|price|cost|budget|talk|contact|human|person|whatsapp)\b|कॉल|कीमत|बात|اتصال|سعر|anruf|preis|appel|prix/i.test(text);
