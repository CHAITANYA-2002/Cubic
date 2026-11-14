import * as THREE from "three";
import { createMaterials, disposeMaterials, disposeObject, lightScene } from "./materials";
import { heroComposition } from "./cube";

const SCREENS = ["superfox-roam", "aria-frontdesk", "helix-analytics"];

/** Mounts the live hero scene into `host` and returns a cleanup function. */
export function mountHeroScene(host: HTMLElement): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.4, 11.2);
  const env = lightScene(scene, renderer);
  const palette = createMaterials();
  const loader = new THREE.TextureLoader();
  const textures = SCREENS.map((name) => {
    const texture = loader.load(`/images/work/${name}-640.webp`);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
  const { root, cube, orbit, ring } = heroComposition(palette, textures);
  root.scale.setScalar(0.9);
  scene.add(root);

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(host);

  const pointer = { x: 0, y: 0 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  let visible = true;
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  io.observe(host);

  const clock = new THREE.Clock();
  let frame = 0;
  let first = true;
  const tick = () => {
    frame = window.requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    root.rotation.y += ((pointer.x * 0.35) - root.rotation.y) * 0.04;
    root.rotation.x += ((pointer.y * 0.18) - root.rotation.x) * 0.04;
    cube.rotation.y = -0.78 + Math.sin(t * 0.35) * 0.25;
    cube.children.forEach((child, index) => {
      const home = child.userData.home as THREE.Vector3;
      const breathe = 1 + (Math.sin(t * 0.9 + index) * 0.5 + 0.5) * 0.07;
      child.position.set(home.x * breathe, home.y * breathe, home.z * breathe);
    });
    orbit.rotation.y = Math.sin(t * 0.25) * 0.18;
    orbit.children.forEach((panel, index) => { panel.position.y += Math.sin(t * 1.1 + index * 2) * 0.0015; });
    ring.rotation.z = t * 0.12;
    renderer.render(scene, camera);
    if (first) {
      first = false;
      host.classList.add("webgl-ready");
    }
  };
  tick();

  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onPointer);
    observer.disconnect();
    io.disconnect();
    host.classList.remove("webgl-ready");
    disposeObject(root);
    textures.forEach((texture) => texture.dispose());
    disposeMaterials(palette);
    env.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
