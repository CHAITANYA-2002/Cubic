/** Four isometric layers that separate when the section scrolls into view (CSS 3D). */
export function ProcessStack() {
  return (
    <div className="iso-stack" aria-hidden="true">
      <div className="iso-scene">
        {["01", "02", "03", "04"].map((label) => (
          <div key={label} className="iso-layer"><span>{label}</span></div>
        ))}
      </div>
    </div>
  );
}
