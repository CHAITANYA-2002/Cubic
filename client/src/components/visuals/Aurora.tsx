/** Slow-drifting gold, teal and violet light behind heroes. Decorative only. */
export function Aurora({ soft = false }: { soft?: boolean }) {
  return (
    <div className={`aurora ${soft ? "aurora-soft" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  );
}
