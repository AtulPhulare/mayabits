// "waves": a rolling field of particles stretching to the horizon.
import * as THREE from "three";
import { pointsGeometry, pointsMaterial } from "./shared.js";

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aRandom;
  varying float vMix;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float h = sin(p.x * 0.35 + uTime * 0.8) * 0.45
            + sin(p.z * 0.5 + uTime * 0.6) * 0.35
            + sin((p.x + p.z) * 0.25 + uTime * 0.4) * 0.4;
    p.y += h;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vMix = clamp(h * 0.6 + 0.5, 0.0, 1.0);
    vAlpha = smoothstep(30.0, 7.0, -mv.z) * smoothstep(0.5, 3.0, -mv.z);   // fade at the horizon and near the camera

    gl_PointSize = uSize * (0.5 + aRandom * 0.6) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

function gridPoints(cols, rows, spacing) {
  const positions = new Float32Array(cols * rows * 3);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      positions.set([(i - cols / 2) * spacing, 0, -j * spacing], (i * rows + j) * 3);
    }
  }
  return positions;
}

export default function waves({ uniforms, pixelRatio }) {
  const material = pointsMaterial({ ...uniforms, uSize: { value: 26 * pixelRatio } }, VERTEX);
  const field = new THREE.Points(pointsGeometry(gridPoints(200, 130, 0.2)), material);
  field.position.set(0, -1.8, 4);

  const object = new THREE.Group();
  object.add(field);
  return { object, update() {} };
}
