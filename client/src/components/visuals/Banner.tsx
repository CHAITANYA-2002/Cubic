import { useLocation } from "wouter";
const pages: Record<string, string> = { services: "architecture", work: "desk", pricing: "geometry", about: "studio", faq: "light-lines", contact: "city", terms: "workspace", privacy: "workspace", cookies: "workspace" };
const services: Record<string, string> = { "web-development": "architecture", "web-applications": "servers", "ai-solutions": "circuit", "digital-marketing": "earth", "ui-ux-design": "workspace", maintenance: "servers" };
export function Banner({ name, hero = true }: { name?: string; hero?: boolean }) {
  const [location] = useLocation();
  const segments = location.split("/").filter(Boolean);
  const image = name ?? services[segments[1]] ?? pages[segments[0]] ?? "geometry";
  return <div className="banner-art" aria-hidden="true"><img src={`/images/banners/${image}.webp`} srcSet={`/images/banners/${image}-960.webp 960w, /images/banners/${image}.webp 1920w`} sizes="100vw" width="1920" height="1080" alt="" loading={hero ? "eager" : "lazy"} fetchPriority={hero ? "high" : undefined} /><div className="banner-shade" /></div>;
}
