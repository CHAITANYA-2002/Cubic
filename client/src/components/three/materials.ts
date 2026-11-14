import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// One material language for every CubicTech 3D object: gold metal, amber metal, teal glass,
// smoked glass and a violet glow. Shared by the live hero scene and the build-time renderer.

export type Palette = ReturnType<typeof createMaterials>;

export function createMaterials() {
  return {
    gold: new THREE.MeshPhysicalMaterial({ color: "#e0b285", metalness: 1, roughness: 0.26, clearcoat: 0.5, clearcoatRoughness: 0.2 }),
    amber: new THREE.MeshPhysicalMaterial({ color: "#b7804f", metalness: 1, roughness: 0.34, clearcoat: 0.3 }),
    teal: new THREE.MeshPhysicalMaterial({
      color: "#3cc4b1", metalness: 0, roughness: 0.06, transmission: 0.92, thickness: 1.1, ior: 1.45,
      attenuationColor: new THREE.Color("#0f5e55"), attenuationDistance: 1.6, clearcoat: 1, transparent: true,
    }),
    smoke: new THREE.MeshPhysicalMaterial({
      color: "#2a2a33", metalness: 0.1, roughness: 0.12, transmission: 0.55, thickness: 0.6, ior: 1.4, clearcoat: 1, transparent: true,
    }),
    ink: new THREE.MeshPhysicalMaterial({ color: "#141418", metalness: 0.6, roughness: 0.35, clearcoat: 0.6 }),
    violet: new THREE.MeshStandardMaterial({ color: "#4b3fa0", emissive: new THREE.Color("#8b7cf6"), emissiveIntensity: 1.8, roughness: 0.4 }),
    glowGold: new THREE.MeshStandardMaterial({ color: "#6b4a2a", emissive: new THREE.Color("#f0c896"), emissiveIntensity: 1.4 }),
    line: new THREE.LineBasicMaterial({ color: "#e0b285", transparent: true, opacity: 0.9 }),
  };
}

/** Studio lighting: soft environment reflections plus a warm key, teal rim and violet fill. */
export function lightScene(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  pmrem.dispose();

  const key = new THREE.DirectionalLight("#ffe2c2", 2.6);
  key.position.set(4, 6, 5);
  const rim = new THREE.DirectionalLight("#3cc4b1", 2.2);
  rim.position.set(-6, 2, -4);
  const fill = new THREE.PointLight("#8b7cf6", 18, 20);
  fill.position.set(-3, -2, 4);
  scene.add(key, rim, fill, new THREE.AmbientLight("#ffffff", 0.25));
  return env;
}

export function disposeObject(root: THREE.Object3D) {
  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    mesh.geometry?.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    (Array.isArray(material) ? material : material ? [material] : []).forEach((item) => item.dispose());
  });
}

export function disposeMaterials(palette: Palette) {
  Object.values(palette).forEach((material) => material.dispose());
}
