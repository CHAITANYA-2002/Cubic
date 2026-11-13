import type { Project } from "@/data/work";
import { projects } from "@/data/work";
import { BrowserFrame } from "@/components/work/ProjectCard";
import { useI18n } from "@/i18n";
export function Laptop({ project }: { project: Project }) {
  return <div className="device-laptop"><div className="laptop-screen"><BrowserFrame project={project} /></div><div className="laptop-base" aria-hidden="true" /></div>;
}
export function DeviceComposition({ compact = false, project = projects[0] }: { compact?: boolean; project?: Project }) {
  const { t } = useI18n();
  return <div className={`device-composition ${compact ? "device-compact" : ""}`}>
    <div className="device-glow" aria-hidden="true" />
    <Laptop project={project} />
    <div className="device-phone"><div className="phone-camera" aria-hidden="true"/><img src={projects[1].image.replace(".webp", "-640.webp")} alt={`${projects[1].name} — ${t.common.accessibility.screenshot}`} width="640" height="400" loading="lazy" /></div>
    {!compact && <><p className="device-sample">{t.visuals.sample}</p><div className="floating-ui float-one">{t.visuals.qualified}</div><div className="floating-ui float-two">{t.visuals.invoice}</div><div className="floating-ui float-three">{t.visuals.deploy}</div></>}
  </div>;
}
