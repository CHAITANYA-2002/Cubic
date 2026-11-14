import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Palette } from "./materials";
import { brandCube, cubie } from "./cube";

// Build-time 3D objects for services and sections. Each returns a group centred at the origin,
// roughly 4 units across, viewed by the renderer from an isometric-ish camera.

const slab = (w: number, h: number, d: number, r = 0.06) => new RoundedBoxGeometry(w, h, d, 3, r);
const at = (mesh: THREE.Object3D, x: number, y: number, z: number) => (mesh.position.set(x, y, z), mesh);

function websites(p: Palette) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(slab(3.2, 2.1, 0.12), p.smoke));
  g.add(at(new THREE.Mesh(slab(3.2, 0.26, 0.16), p.gold), 0, 0.92, 0.02));
  g.add(at(new THREE.Mesh(slab(1.3, 1.1, 0.12), p.teal), -0.75, -0.25, 0.45));
  g.add(at(new THREE.Mesh(slab(1.4, 0.18, 0.08), p.glowGold), 0.7, 0.2, 0.3));
  g.add(at(new THREE.Mesh(slab(1.1, 0.14, 0.08), p.amber), 0.55, -0.12, 0.3));
  g.add(at(new THREE.Mesh(slab(1.25, 0.14, 0.08), p.amber), 0.62, -0.42, 0.3));
  const gauge = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 16, 64, Math.PI * 1.3), p.violet);
  gauge.rotation.z = -0.4;
  g.add(at(gauge, 1.05, -0.7, 0.55));
  g.rotation.set(-0.25, 0.55, 0.05);
  return g;
}

function webapps(p: Palette) {
  const g = new THREE.Group();
  g.add(at(new THREE.Mesh(slab(3.2, 0.14, 2.2, 0.05), p.ink), 0, -0.9, 0));
  const heights = [0.8, 1.4, 1.0, 1.9, 1.5];
  heights.forEach((h, i) => {
    const material = i % 2 ? p.teal : p.gold;
    g.add(at(new THREE.Mesh(slab(0.38, h, 0.38, 0.05), material), -1.1 + i * 0.55, -0.83 + h / 2, 0));
  });
  const curve = new THREE.CatmullRomCurve3(heights.map((h, i) => new THREE.Vector3(-1.1 + i * 0.55, -0.62 + h, 0.45)));
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.03, 8, false), p.violet));
  g.rotation.set(0.45, -0.6, 0);
  return g;
}

function ai(p: Palette) {
  const g = new THREE.Group();
  const nodes = [new THREE.Vector3(-1.2, -0.4, 0), new THREE.Vector3(0, 0.5, 0.2), new THREE.Vector3(1.2, -0.3, -0.1), new THREE.Vector3(0.1, -1, 0.4)];
  nodes.forEach((v, i) => g.add(at(new THREE.Mesh(new THREE.SphereGeometry(i === 1 ? 0.34 : 0.24, 48, 48), i === 1 ? p.gold : p.amber), v.x, v.y, v.z)));
  [[0, 1], [1, 2], [0, 3], [3, 2], [1, 3]].forEach(([a, b]) => {
    const curve = new THREE.LineCurve3(nodes[a], nodes[b]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.025, 8, false), p.violet));
  });
  g.add(at(new THREE.Mesh(slab(1.3, 0.55, 0.22, 0.2), p.teal), -0.9, 1.05, 0.3));
  g.add(at(new THREE.Mesh(slab(1.0, 0.45, 0.22, 0.18), p.smoke), 1.0, 0.85, -0.2));
  g.rotation.set(0.2, -0.35, 0);
  return g;
}

function marketing(p: Palette) {
  const g = new THREE.Group();
  const profile = [new THREE.Vector2(0.15, -1.1), new THREE.Vector2(0.18, -0.4), new THREE.Vector2(1.1, 0.7), new THREE.Vector2(1.15, 0.8)];
  const funnel = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), p.teal);
  (funnel.material as THREE.Material).side = THREE.DoubleSide;
  g.add(funnel);
  g.add(at(new THREE.Mesh(new THREE.TorusGeometry(1.13, 0.04, 16, 96), p.gold), 0, 0.78, 0)).rotation.x = Math.PI / 2;
  [0, 2.1, 4.2].forEach((angle, i) => {
    const env = new THREE.Mesh(slab(0.5, 0.34, 0.06, 0.04), i === 1 ? p.violet : p.gold);
    env.position.set(Math.cos(angle) * 1.6, 0.9 + i * 0.25, Math.sin(angle) * 1.6);
    env.lookAt(0, 0.9, 0);
    g.add(env);
  });
  g.rotation.set(0.35, 0, 0);
  return g;
}

function uiux(p: Palette) {
  const g = new THREE.Group();
  const base = slab(2.6, 1.7, 0.08);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 1.7, 0.02)), p.line);
  g.add(at(wire, 0, -0.9, 0));
  g.add(at(new THREE.Mesh(base, p.teal), 0, 0, 0.1));
  const top = at(new THREE.Mesh(base, p.ink), 0, 0.9, 0.2);
  g.add(top);
  g.add(at(new THREE.Mesh(slab(2.6, 0.2, 0.1), p.gold), 0, 1.65, 0.24));
  g.add(at(new THREE.Mesh(slab(0.9, 0.9, 0.1), p.amber), -0.7, 0.75, 0.3));
  g.rotation.set(-0.7, 0.5, 0.35);
  return g;
}

function care(p: Palette) {
  const g = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.2);
  shape.bezierCurveTo(0.6, 1.0, 0.9, 0.95, 1.0, 0.9);
  shape.bezierCurveTo(1.0, -0.2, 0.6, -0.9, 0, -1.25);
  shape.bezierCurveTo(-0.6, -0.9, -1.0, -0.2, -1.0, 0.9);
  shape.bezierCurveTo(-0.9, 0.95, -0.6, 1.0, 0, 1.2);
  const shield = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 6 }), p.gold);
  shield.position.z = -0.15;
  g.add(shield);
  const check = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.4, 0, 0.3), new THREE.Vector3(-0.1, -0.3, 0.3), new THREE.Vector3(0.45, 0.35, 0.3)], false, "catmullrom", 0);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(check, 32, 0.07, 12, false), p.teal));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.03, 12, 128), p.violet);
  ring.rotation.x = Math.PI / 2.4;
  g.add(ring);
  g.rotation.set(0.1, -0.45, 0);
  return g;
}

function processStack(p: Palette) {
  const g = new THREE.Group();
  [p.ink, p.teal, p.amber, p.gold].forEach((material, i) => g.add(at(new THREE.Mesh(slab(2.2, 0.22, 2.2, 0.08), material), 0, -1.1 + i * 0.68, 0)));
  g.rotation.set(0.55, 0.78, 0);
  return g;
}

function ctaCluster(p: Palette) {
  const g = brandCube(p, 0.45);
  g.add(at(new THREE.Mesh(cubie(0.45, 0.06), p.violet), 1.6, 1.2, -0.4));
  g.add(at(new THREE.Mesh(cubie(0.35, 0.05), p.gold), -1.7, -1.1, 0.6));
  return g;
}

function faq(p: Palette) {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.7, 0.7, 0), new THREE.Vector3(-0.4, 1.25, 0), new THREE.Vector3(0.4, 1.25, 0),
    new THREE.Vector3(0.7, 0.75, 0), new THREE.Vector3(0.1, 0.15, 0), new THREE.Vector3(0, -0.35, 0),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 96, 0.2, 24, false), p.teal));
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.24, 48, 48), p.gold), 0, -0.95, 0));
  g.rotation.set(0.1, -0.5, 0.08);
  return g;
}

function broken(p: Palette) {
  const g = brandCube(p, 0.1);
  g.children.forEach((child, i) => {
    if (i % 3 === 0) {
      child.position.multiplyScalar(2.1);
      child.rotation.set(i * 0.4, i * 0.3, 0);
    }
  });
  return g;
}

export const OBJECTS = {
  "web-development": websites,
  "web-applications": webapps,
  "ai-solutions": ai,
  "digital-marketing": marketing,
  "ui-ux-design": uiux,
  maintenance: care,
  process: processStack,
  cta: ctaCluster,
  faq,
  "not-found": broken,
} satisfies Record<string, (palette: Palette) => THREE.Group>;

export type ObjectName = keyof typeof OBJECTS;
