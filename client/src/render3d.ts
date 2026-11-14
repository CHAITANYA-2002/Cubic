// Build-time renderer (script/render-3d.ts drives it with headless Chrome). Not part of the site.
import * as THREE from "three";
import { createMaterials, lightScene } from "@/components/three/materials";
import { OBJECTS, type ObjectName } from "@/components/three/objects";
import { heroComposition } from "@/components/three/cube";

declare global {
  interface Window { __ready?: boolean }
}

const params = new URLSearchParams(window.location.search);
const name = params.get("obj") ?? "cta";
const width = Number(params.get("w") ?? 800);
const height = Number(params.get("h") ?? width);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(2);
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
camera.position.set(0, 0.4, name === "hero" ? 11.2 : 9.2);
camera.lookAt(0, 0, 0);
lightScene(scene, renderer);
const palette = createMaterials();

async function loadTextures() {
  const loader = new THREE.TextureLoader();
  const files = ["superfox-roam", "aria-frontdesk", "helix-analytics"];
  return Promise.all(files.map((file) => loader.loadAsync(`/images/work/${file}-640.webp`).then((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  })));
}

async function main() {
  if (name === "hero") {
    const { root } = heroComposition(palette, await loadTextures());
    root.scale.setScalar(0.9);
    scene.add(root);
  } else {
    scene.add(OBJECTS[name as ObjectName](palette));
  }
  renderer.render(scene, camera);
  window.__ready = true;
}

void main();
