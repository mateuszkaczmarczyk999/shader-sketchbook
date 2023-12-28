import { BufferAttribute, BufferGeometry } from "three";

const vertices = new Float32Array([
     0.0,  0.5, 0.0,  // top center
    -0.5, -0.5, 0.0,  // bottom left
     0.5, -0.5, 0.0   // bottom right
]);

export const createBufferGeometry = () => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    return geometry;
}