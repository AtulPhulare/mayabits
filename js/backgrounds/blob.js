// "blob": a liquid, noise-displaced sphere with an iridescent rim.
import * as THREE from "three";
import { NOISE_GLSL } from "./shared.js";

const VERTEX = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  ${NOISE_GLSL}

  float displace(vec3 p) {
    return snoise(p * 0.9 + uTime * 0.25) * 0.28 + snoise(p * 2.2 - uTime * 0.15) * 0.06;
  }

  void main() {
    // Rebuild the normal from two nearby displaced points so lighting follows the surface
    vec3 n = normalize(position);
    vec3 tangent = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 bitangent = cross(n, tangent);

    float d = displace(position);
    vec3 p = position + n * d;
    vec3 pt = position + tangent * 0.01;
    pt += normalize(pt) * displace(pt);
    vec3 pb = position + bitangent * 0.01;
    pb += normalize(pb) * displace(pb);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * cross(pt - p, pb - p));
    vView = normalize(-mv.xyz);
    vNoise = d;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 light = normalize(vec3(0.4, 0.8, 0.6));
    float fresnel = pow(1.0 - max(dot(normal, vView), 0.0), 2.5);
    float diffuse = max(dot(normal, light), 0.0);
    float specular = pow(max(dot(reflect(-light, normal), vView), 0.0), 32.0);

    vec3 base = mix(uColorA, uColorB, smoothstep(-0.25, 0.25, vNoise));
    vec3 color = base * (0.1 + diffuse * 0.35) + base * fresnel * 1.3 + specular * 0.35;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function blob({ uniforms }) {
  const mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.45, 48),
    new THREE.ShaderMaterial({ uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT })
  );
  return {
    object: mesh,
    update(delta, speed) {
      mesh.rotation.y += delta * 0.08 * speed;
    },
  };
}
