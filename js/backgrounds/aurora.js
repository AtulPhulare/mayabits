// "aurora": a full-screen flowing gradient, the calmest option.
import * as THREE from "three";
import { NOISE_GLSL } from "./shared.js";

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);   // covers the screen regardless of the camera
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uOffset;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  ${NOISE_GLSL}

  void main() {
    vec2 p = vUv - 0.5;
    p.x *= uAspect;
    p -= uOffset;

    float n1 = snoise(vec3(p * 1.2, uTime * 0.08));
    float n2 = snoise(vec3(p * 2.4 + n1, uTime * 0.12));
    float bands = smoothstep(0.0, 0.9, n2 * 0.5 + 0.5);
    float glow = exp(-dot(p, p) * 1.6);

    vec3 color = mix(uColorA, uColorB, smoothstep(-0.6, 0.6, n1));
    float alpha = glow * (0.35 + 0.65 * bands) * 0.85;
    gl_FragColor = vec4(color * alpha, alpha);   // premultiplied for the transparent canvas
  }
`;

export default function aurora({ uniforms }) {
  const local = { uAspect: { value: 1 }, uOffset: { value: new THREE.Vector2() } };
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: { ...uniforms, ...local },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
    })
  );
  mesh.frustumCulled = false;

  return {
    object: mesh,
    stars: false,
    update(delta, speed, { group }) {
      // The plane ignores transforms, so follow the page layout through the shader instead
      local.uAspect.value = window.innerWidth / window.innerHeight;
      local.uOffset.value.set(group.position.x * 0.2, group.position.y * 0.2);
    },
  };
}
