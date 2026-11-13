import type { ServiceSlug } from "@/data/services";
const drawings: Record<ServiceSlug, React.ReactNode> = {
  "web-development": <><rect x="30" y="25" width="260" height="150" rx="12"/><path d="M30 53h260M46 40h4m8 0h4m8 0h4M48 73h92v80H48zM158 75h107m-107 18h80m-80 18h95"/><path d="M208 154a31 31 0 0 1 62 0m-31 0 18-19"/></>,
  "web-applications": <><rect x="30" y="25" width="260" height="150" rx="12"/><path d="M87 25v150M45 49h26M45 69h26M45 89h26M105 138h165M106 105l35-24 37 13 39-37 45 12M106 154h34m16 0h34m16 0h55"/><path d="M122 124V99m35 25V92m36 32V81m35 43V62m33 62V80"/></>,
  "ai-solutions": <><path d="M35 38h98v53H72L49 108V91H35zM184 30h99v53h-22l-24 17V83h-53zM82 140h59m36 0h57M159 94v25"/><circle cx="159" cy="140" r="20"/><circle cx="63" cy="140" r="15"/><circle cx="254" cy="140" r="22"/><path d="m243 140 8 8 15-17M56 58h55m-55 14h40M201 50h65m-65 14h35"/></>,
  "digital-marketing": <><path d="M100 25h122l-35 58v39l-48 27V83zM47 91l26-17 26 17v40H47zM47 91l26 20 26-20M218 132h55M235 151h38"/><circle cx="245" cy="70" r="21"/><path d="m261 85 22 23M73 131v29h66M217 70h-22M160 149v23h75"/></>,
  "ui-ux-design": <><rect x="25" y="32" width="111" height="140" rx="10"/><rect x="186" y="32" width="111" height="140" rx="10"/><path d="M40 50h80v38H40zM40 104h80m-80 15h60m-60 15h75M148 100h27m-9-9 9 9-9 9"/><rect x="201" y="49" width="80" height="48" rx="6" fill="currentColor" fillOpacity=".12"/><path d="M202 116h77m-77 15h55m-55 19h77"/></>,
  maintenance: <><path d="M32 53h130M32 86h30l15-27 19 57 18-30h48M32 141h130M32 162h85M233 31l52 19v53c0 34-30 58-52 70-23-12-52-36-52-70V50z"/><path d="m210 96 17 17 31-37"/></>,
};
export function ServiceIllustration({ service }: { service: ServiceSlug }) {
  return <svg className="service-illustration" viewBox="0 0 320 200" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[service]}</svg>;
}
