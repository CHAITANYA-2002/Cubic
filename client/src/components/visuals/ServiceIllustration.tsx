import type { ServiceSlug } from "@/data/services";
import { Render3D } from "./Render3D";

/** The service's rendered 3D object (see script/render-3d.ts) on a soft glow stage. */
export function ServiceIllustration({ service }: { service: ServiceSlug }) {
  return (
    <div className="render-stage service-art">
      <Render3D name={service} float sizes="(min-width: 1024px) 320px, 60vw" />
    </div>
  );
}
