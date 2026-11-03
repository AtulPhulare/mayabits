// "orb": a breathing particle sphere with an orbit ring (the original background).
import * as THREE from "three";
import { pointsGeometry, pointsMaterial } from "./shared.js";

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aRandom;
  varying float vMix;
  varying float vAlpha;

  void main() {
    vec3 dir = normalize(position);
    float wave = sin(dir.x * 3.0 + uTime * 0.9) * sin(dir.y * 3.0 + uTime * 0.7) * sin(dir.z * 3.0 + uTime * 1.1);
    float pulse = sin(uTime * 0.6 + aRandom * 6.2831) * 0.04;
    vec3 p = position + dir * (wave * 0.35 + pulse);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vMix = clamp(wave * 0.8 + 0.5 + dir.y * 0.3, 0.0, 1.0);
    vAlpha = 0.25 + 0.75 * smoothstep(8.0, 4.5, -mv.z);   // points facing the camera glow brighter

    gl_PointSize = uSize * (0.6 + aRandom) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

/** Evenly distributed points on a sphere (Fibonacci lattice). */
function spherePoints(count, radius) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions.set([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius], i * 3);
  }
  return positions;
}

/** Points scattered in a flat ring. */
function ringPoints(count, inner, outer) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = inner + Math.random() * (outer - inner);
    positions.set([Math.cos(angle) * radius, (Math.random() - 0.5) * 0.08, Math.sin(angle) * radius], i * 3);
  }
  return positions;
}

export default function orb({ uniforms, pixelRatio }) {
  const material = pointsMaterial({ ...uniforms, uSize: { value: 30 * pixelRatio } }, VERTEX);
  const object = new THREE.Group();
  const sphere = new THREE.Points(pointsGeometry(spherePoints(6000, 1.6)), material);
  const ring = new THREE.Points(pointsGeometry(ringPoints(2500, 2.4, 3.1)), material);
  ring.rotation.set(1.15, 0, 0.35);
  object.add(sphere, ring);

  return {
    object,
    update(delta, speed) {
      object.rotation.y += delta * 0.12 * speed;
    },
  };
}
