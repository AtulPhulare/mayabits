// Three.js background. The 3D content comes from a variant in js/backgrounds/ (chosen by
// `site.background` in config.js, or `?bg=<name>` in the URL for previewing).
// Its colors and position follow the current page (see `theme` returned by each page).
import * as THREE from "three";
import { shellPoints, pointsGeometry } from "./backgrounds/shared.js";

export const BACKGROUNDS = ["orb", "waves", "blob", "icons", "aurora"];

export function createScene(canvas, variant = "orb") {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    canvas.remove(); // WebGL unavailable: the site still works without the background
    return { setTheme() {}, setMode() {} };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 6;

  // Shared uniforms so every part of the background matches the page colors
  const uniforms = {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color("#6366f1") },
    uColorB: { value: new THREE.Color("#a855f7") },
  };

  // The variant's object goes inside `group`, which follows the page layout and the pointer
  const group = new THREE.Group();
  scene.add(group);

  const stars = new THREE.Points(
    pointsGeometry(shellPoints(1500, 10, 30)),
    new THREE.PointsMaterial({ size: 0.06, color: 0x9ca3af, transparent: true, opacity: 0.55, depthWrite: false })
  );
  scene.add(stars);

  // Light / dark: glowing additive points wash out on a light page, so blend them normally there
  let mode = "dark";
  function applyMode() {
    const light = mode === "light";
    stars.material.color.set(light ? 0x71717a : 0x9ca3af);
    group.traverse((obj) => {
      const material = obj.material;
      if (!material?.isShaderMaterial || material.userData.additive === false) return;
      if (material.userData.additive === undefined) material.userData.additive = material.blending === THREE.AdditiveBlending;
      if (!material.userData.additive) return;
      material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      material.needsUpdate = true;
    });
  }

  let background = null;
  const name = BACKGROUNDS.includes(variant) ? variant : "orb";
  import(`./backgrounds/${name}.js`).then(({ default: create }) => {
    background = create({ uniforms, pixelRatio, renderer, scene, camera });
    group.add(background.object);
    stars.visible = background.stars !== false;
    applyMode();
  });

  // ---- State that eases toward targets every frame ----
  const target = {
    colorA: uniforms.uColorA.value.clone(),
    colorB: uniforms.uColorB.value.clone(),
    layout: "center",
    pointer: new THREE.Vector2(),
  };

  function layoutFor(name) {
    const wide = window.innerWidth >= 1024;
    const mobile = window.innerWidth < 640;
    const base = { x: 0, y: 0, scale: mobile ? 0.75 : 1, opacity: 1 };
    if (name === "side" && wide) return { ...base, x: 2.3, scale: 0.85 };
    if (name === "side") return { ...base, y: -0.5, opacity: 0.6 };
    if (name === "dim") return { ...base, x: wide ? 2.6 : 0, opacity: 0.3 };
    return base;
  }

  function resize() {
    const { innerWidth: w, innerHeight: h } = window;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => {
    target.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  });
  resize();

  // ---- Render loop ----
  const clock = new THREE.Clock();
  let opacity = 1;

  renderer.setAnimationLoop(() => {
    if (document.hidden) return;

    const delta = Math.min(clock.getDelta(), 0.05);
    const speed = reducedMotion ? 0 : 1;
    const ease = 1 - Math.pow(0.001, delta); // frame-rate independent easing
    const layout = layoutFor(target.layout);

    uniforms.uTime.value += delta * speed;
    uniforms.uColorA.value.lerp(target.colorA, ease);
    uniforms.uColorB.value.lerp(target.colorB, ease);

    if (background && background.followLayout !== false) {
      group.rotation.x += (target.pointer.y * 0.25 - group.rotation.x) * ease * 0.5;
      group.position.x += (layout.x + target.pointer.x * 0.15 - group.position.x) * ease;
      group.position.y += (layout.y - group.position.y) * ease;
      group.scale.setScalar(group.scale.x + (layout.scale - group.scale.x) * ease);
    }
    stars.rotation.y -= delta * 0.01 * speed;
    background?.update(delta, speed, { group, layout: target.layout, pointer: target.pointer, ease });

    // Fade out as the user scrolls down so content stays readable
    const scrollFade = 1 - Math.min(window.scrollY / window.innerHeight, 1) * 0.65;
    opacity += (layout.opacity * scrollFade - opacity) * ease;
    canvas.style.opacity = opacity.toFixed(3);

    renderer.render(scene, camera);
  });

  return {
    /** @param {{ colors: [string, string], layout: "center" | "side" | "dim" }} theme */
    setTheme({ colors, layout }) {
      target.colorA.set(colors[0]);
      target.colorB.set(colors[1]);
      target.layout = layout;
    },
    /** @param {"light" | "dark"} next */
    setMode(next) {
      mode = next;
      applyMode();
    },
  };
}
