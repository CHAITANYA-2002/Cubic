import { useI18n } from "@/i18n";
const icons = ["react", "typescript", "nextdotjs", "nodedotjs", "postgresql", "tailwindcss", "cloudflare", "vercel", "openai", "anthropic"];
export function TechnologyStrip() {
  const { t } = useI18n();
  const items = (duplicate: boolean) => t.visuals.technologies.map((name,i)=><li key={name} aria-hidden={duplicate || undefined}><img src={`/images/technology/${icons[i]}.svg`} alt="" width="28" height="28" loading="lazy"/><span>{name}</span></li>);
  return <section className="technology-strip"><div className="container-w"><p className="mb-6 text-center font-mono text-xs t-secondary">{t.visuals.builtWith}</p><div className="tech-window"><ul className="tech-track">{items(false)}{items(true)}</ul></div></div></section>;
}
export function StatsBand() {
  const { t } = useI18n();
  return <div className="stats-band"><ul className="container-w">{t.visuals.stats.map(s=><li key={s}>{s}</li>)}</ul></div>;
}
