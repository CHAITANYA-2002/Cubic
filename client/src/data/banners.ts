const pages: Record<string, string> = { services: "architecture", work: "desk", pricing: "geometry", about: "studio", faq: "light-lines", contact: "city", terms: "workspace", privacy: "workspace", cookies: "workspace" };
const services: Record<string, string> = { "web-development": "architecture", "web-applications": "servers", "ai-solutions": "circuit", "digital-marketing": "earth", "ui-ux-design": "workspace", maintenance: "servers" };
export function bannerForPath(path: string) {
  const segments = path.split("/").filter(Boolean);
  return (Object.prototype.hasOwnProperty.call(services, segments[1]) ? services[segments[1]] : undefined)
    ?? (Object.prototype.hasOwnProperty.call(pages, segments[0]) ? pages[segments[0]] : "geometry");
}
