import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Palette } from "./materials";

export const cubie = (size: number, radius = 0.08) => new RoundedBoxGeometry(size, size, size, 4, radius);

/**
 * The brand cube as a 2×2×2 block of rounded cubies: gold crown, teal-glass left column and
 * amber right column — the 3D version of the logo mark. `spread` separates the layers.
 */
export function brandCube(palette: Palette, spread = 0.1): THREE.Group {
  const group = new THREE.Group();
  const size = 0.95;
  const step = size + spread;
  const geometry = cubie(size, 0.12);
  for (const x of [-0.5, 0.5]) {
    for (const y of [-0.5, 0.5]) {
      for (const z of [-0.5, 0.5]) {
        const material = y > 0 ? palette.gold : x < 0 ? palette.teal : palette.amber;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x * step, y * step, z * step);
        mesh.userData.home = mesh.position.clone();
        group.add(mesh);
      }
    }
  }
  group.rotation.set(0.62, -0.78, 0);
  return group;
}

/** A thin glass panel carrying a project screenshot. */
export function screenPanel(texture: THREE.Texture | null, palette: Palette, width = 1.6): THREE.Group {
  const group = new THREE.Group();
  const height = width * 0.625;
  const frame = new THREE.Mesh(new RoundedBoxGeometry(width + 0.08, height + 0.08, 0.05, 3, 0.03), palette.smoke);
  group.add(frame);
  if (texture) {
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
    );
    screen.position.z = 0.03;
    group.add(screen);
  }
  return group;
}

/** Hero composition: brand cube with three orbiting project panels. */
export function heroComposition(palette: Palette, textures: Array<THREE.Texture | null>) {
  const root = new THREE.Group();
  const cube = brandCube(palette);
  root.add(cube);
  const orbit = new THREE.Group();
  const placements: Array<[number, number, number, number]> = [
    [2.35, 0.75, -0.4, -0.5],
    [-2.3, -0.55, 0.2, 0.45],
    [1.7, -1.55, 0.9, -0.25],
  ];
  placements.forEach(([x, y, z, ry], index) => {
    const panel = screenPanel(textures[index] ?? null, palette, index === 2 ? 1.2 : 1.5);
    panel.position.set(x, y, z);
    panel.rotation.set(0.05, ry, 0.03);
    orbit.add(panel);
  });
  root.add(orbit);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.012, 8, 160), palette.glowGold);
  ring.rotation.set(Math.PI / 2.2, 0, 0.3);
  root.add(ring);
  return { root, cube, orbit, ring };
}
