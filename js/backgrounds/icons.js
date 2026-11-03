// "icons": your apps as glossy 3D icons floating among metallic shapes.
// Uses Three.js addons: RoundedBoxGeometry and RoomEnvironment (studio reflections).
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { apps } from "../config.js";

/** Icon face: the app's gradient with its emoji on top. */
function iconTexture(app) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, app.colors[0]);
  gradient.addColorStop(1, app.colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  ctx.font = "130px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(app.icon, 128, 136);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Where objects sit for each page layout, in screen space so they frame the content at any
// window size: [x, y] from -1 (left/bottom) to 1 (right/top), z depth, scale.
// App icons fill `icons` in order (extra apps beyond the list are hidden); shapes fill `shapes`.
const SLOTS = {
  // Home: the four corners around the centered hero text, shapes further back
  center: {
    icons: [[-0.84, 0.36, -1.5, 0.9], [0.84, 0.42, -1.5, 0.9], [0.8, -0.5, -1.8, 0.85], [-0.82, -0.5, -1.8, 0.85], [-0.95, -0.02, -3, 0.7], [0.95, -0.02, -3, 0.7]],
    shapes: [[-0.6, 0.62, -4, 0.75], [0.5, 0.7, -3.5, 1], [-0.4, -0.84, -4, 0.9], [0.42, -0.8, -3.5, 1]],
  },
  // App page on wide screens: around the phone mockup on the right
  side: {
    icons: [[0.8, 0.4, -1.5, 0.75], [0.8, -0.35, -1.8, 0.7], [0.15, 0.55, -2.5, 0.65], [0.1, -0.62, -2.2, 0.7], [0.95, 0.02, -4, 0.6], [0.5, -0.98, -3.5, 0.6]],
    shapes: [[-0.6, -0.9, -5, 0.7], [0.5, 0.82, -4, 0.8], [0.75, -0.85, -3, 1], [0.35, -0.95, -4, 0.8]],
  },
  // Phones, narrow app pages and privacy pages: tucked into the corners, partly off-screen
  edges: {
    icons: [[-0.95, 0.6, -2, 0.55], [0.95, 0.5, -2, 0.55], [0.9, -0.78, -2, 0.55], [-0.92, -0.62, -2.5, 0.55], [1, 0, -4, 0.5], [-1, 0.1, -4, 0.5]],
    shapes: [[0.98, -0.2, -4, 0.5], [0.3, 0.92, -4, 0.6], [-0.35, -0.92, -4, 0.6], [0.3, -0.98, -4, 0.5]],
  },
};

const bigger = (slots) => slots.map(([x, y, z, s]) => [x, y, z, s * 1.4]);

function slotsFor(layout) {
  if (window.innerWidth < 640) return SLOTS.edges;
  if (layout === "center") return SLOTS.center;
  if (layout === "side" && window.innerWidth >= 1024) return SLOTS.side;
  return { icons: bigger(SLOTS.edges.icons), shapes: bigger(SLOTS.edges.shapes) };
}

export default function icons({ uniforms, renderer, scene, camera }) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  pmrem.dispose();

  const object = new THREE.Group();
  const floaters = [];
  const add = (mesh, kind) => {
    mesh.rotation.set(Math.random() * 0.6 - 0.3, Math.random() * 0.8 - 0.4, Math.random() * 0.4 - 0.2);
    object.add(mesh);
    floaters.push({ mesh, kind, slot: floaters.filter((f) => f.kind === kind).length, phase: Math.random() * Math.PI * 2, spin: 0.15 + Math.random() * 0.2 });
  };

  const iconGeometry = new RoundedBoxGeometry(1, 1, 0.26, 6, 0.2);
  apps.forEach((app) => {
    const material = new THREE.MeshPhysicalMaterial({ map: iconTexture(app), roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 });
    add(new THREE.Mesh(iconGeometry, material), "icons");
  });

  // Accent shapes tinted by the page colors
  const accentA = new THREE.MeshPhysicalMaterial({ metalness: 0.7, roughness: 0.18, clearcoat: 1, iridescence: 0.6 });
  const accentB = accentA.clone();
  add(new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.2, 48, 96), accentA), "shapes");
  add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), accentB), "shapes");
  add(new THREE.Mesh(new THREE.SphereGeometry(0.35, 48, 32), accentA), "shapes");
  add(new THREE.Mesh(new THREE.TorusKnotGeometry(0.35, 0.12, 128, 24), accentB), "shapes");

  const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
  const goal = new THREE.Vector3();
  let time = 0;
  let placed = false;   // first frame snaps into place; later layout changes glide

  return {
    object,
    followLayout: false,   // places itself per layout instead of being shifted as a whole
    update(delta, speed, { layout, pointer, ease }) {
      time += delta * speed;
      accentA.color.copy(uniforms.uColorA.value);
      accentB.color.copy(uniforms.uColorB.value);

      const slots = slotsFor(layout);
      // Past the hero, objects spread to the screen edges and sink back so they don't sit behind content
      const scrolled = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      floaters.forEach(({ mesh, kind, slot, phase, spin }) => {
        const [slotX, y, slotZ, slotScale] = slots[kind][slot] ?? [0, 0, -10, 0];   // hide anything beyond the last slot
        const x = slotX + Math.sign(slotX || 1) * scrolled * 0.45;
        const z = slotZ - scrolled * 1.5;
        const scale = slotScale * (1 - scrolled * 0.25);
        const halfHeight = Math.tan(halfFov) * (camera.position.z - z);
        const parallax = 0.25 * (4 / (camera.position.z - z));   // nearer objects move more
        goal.set(
          x * halfHeight * camera.aspect - pointer.x * parallax,
          y * halfHeight + pointer.y * parallax + Math.sin(time * 0.8 + phase) * 0.15,
          z
        );
        const t = placed ? ease * 0.6 : 1;
        mesh.position.lerp(goal, t);
        mesh.scale.setScalar(mesh.scale.x + (scale - mesh.scale.x) * t);
        mesh.rotation.y += delta * spin * speed;
      });
      placed = true;
    },
  };
}
