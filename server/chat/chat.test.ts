import { describe, expect, it } from "vitest";
import { DEFAULT_SITE } from "../../shared/site";
import { buildCorpus } from "./knowledge";
import { fallbackAnswer, history, readModelText, systemPrompt } from "./prompt";
import { retrieve, tokens, wantsToTalk } from "./retrieve";

const corpus = buildCorpus(DEFAULT_SITE, [
  { id: 7, question: "Do you build Shopify stores?", answer: "Yes, we build custom Shopify themes.", tags: "ecommerce", active: true, createdAt: "", updatedAt: "" },
  { id: 8, question: "Hidden answer", answer: "Should not appear.", tags: "", active: false, createdAt: "", updatedAt: "" },
]);

describe("knowledge corpus", () => {
  it("always has contact and live prices first", () => {
    expect(corpus[0].id).toBe("contact");
    expect(corpus[0].text).toContain(DEFAULT_SITE.email);
    expect(corpus[1].id).toBe("prices");
    expect(corpus[1].text).toContain("₹1,50,000–₹4,00,000");
  });
  it("includes active taught answers only", () => {
    expect(corpus.some((chunk) => chunk.text.includes("Shopify"))).toBe(true);
    expect(corpus.some((chunk) => chunk.text.includes("Should not appear"))).toBe(false);
  });
  it("covers services, FAQ and work", () => {
    expect(corpus.some((chunk) => chunk.id.startsWith("service-ai-solutions"))).toBe(true);
    expect(corpus.some((chunk) => chunk.id.startsWith("faq-"))).toBe(true);
    expect(corpus.some((chunk) => chunk.text.includes("Interviewly"))).toBe(true);
  });
  it("keeps chunks small", () => {
    expect(Math.max(...corpus.map((chunk) => chunk.text.length))).toBeLessThan(3000);
  });
});

describe("retrieve", () => {
  it("returns core chunks plus the best match within budget", () => {
    const picked = retrieve(corpus, "do you make shopify ecommerce stores?");
    expect(picked.slice(0, 2).map((chunk) => chunk.id)).toEqual(["contact", "prices"]);
    expect(picked.some((chunk) => chunk.id === "kb-7")).toBe(true);
    expect(picked.reduce((sum, chunk) => sum + chunk.text.length, 0)).toBeLessThanOrEqual(9000);
  });
  it("falls back to FAQ and services for questions in another script", () => {
    const picked = retrieve(corpus, "वेबसाइट की कीमत कितनी है");
    expect(picked.some((chunk) => chunk.id.startsWith("faq-") || chunk.id.startsWith("service-"))).toBe(true);
  });
  it("tokenises without punctuation or stop words", () => {
    expect(tokens("What's the PRICE, for an AI-agent?")).toEqual(["price", "agent"]);
  });
});

describe("prompt helpers", () => {
  it("states the grounding rules and the visitor's language", () => {
    const prompt = systemPrompt(corpus.slice(0, 2), "de", "Fully booked until March.");
    expect(prompt).toContain("Answer only from the FACTS");
    expect(prompt).toContain("German");
    expect(prompt).toContain("Fully booked until March.");
  });
  it("reads both Workers AI response shapes", () => {
    expect(readModelText({ response: " hi " })).toBe("hi");
    expect(readModelText({ choices: [{ message: { content: "yo" } }] })).toBe("yo");
    expect(readModelText(null)).toBe("");
  });
  it("trims history to the last turns", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ role: "user" as const, content: `m${i}`, at: "" }));
    expect(history(many, 4).map((m) => m.content)).toEqual(["m16", "m17", "m18", "m19"]);
  });
  it("falls back to the best-matching FAQ answer plus the human options", () => {
    const question = "What are the payment terms?";
    const answer = fallbackAnswer(retrieve(corpus, question), question);
    expect(answer).toContain("40%");
    expect(answer).toContain("/book");
  });
  it("answers price questions from the live price list", () => {
    const question = "How much does a business website cost?";
    expect(fallbackAnswer(retrieve(corpus, question), question)).toContain("Business website: ₹1,50,000–₹4,00,000");
  });
  it("uses a taught answer without its tags line", () => {
    const question = "Do you build Shopify stores?";
    const answer = fallbackAnswer(retrieve(corpus, question), question);
    expect(answer).toContain("custom Shopify themes");
    expect(answer).not.toContain("Tags:");
  });
  it("offers only the human options when nothing matches", () => {
    const answer = fallbackAnswer(retrieve(corpus, "zzzz qqqq"), "zzzz qqqq");
    expect(answer.startsWith("For anything specific")).toBe(true);
  });
  it("spots visitors who want to talk", () => {
    expect(wantsToTalk("can I book a call?")).toBe(true);
    expect(wantsToTalk("what tech stack do you use")).toBe(false);
  });
});
