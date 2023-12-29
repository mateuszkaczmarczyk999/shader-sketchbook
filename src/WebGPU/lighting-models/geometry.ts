import { SphereGeometry } from "three";

export const createBufferGeometry = (device: GPUDevice) => {
    const geometry = new SphereGeometry(1, 32, 32);

    // Extracting vertex positions
    const positions = geometry.attributes.position.array;
    const positionBuffer = device.createBuffer({
        size: positions.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
    });
    new Float32Array(positionBuffer.getMappedRange()).set(positions);
    positionBuffer.unmap();

    // Extracting normals
    const normals = geometry.attributes.normal.array;
    const normalBuffer = device.createBuffer({
        size: normals.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
    });
    new Float32Array(normalBuffer.getMappedRange()).set(normals);
    normalBuffer.unmap();

    // Extracting UVs
    const uvs = geometry.attributes.uv.array;
    const uvBuffer = device.createBuffer({
        size: uvs.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
    });
    new Float32Array(uvBuffer.getMappedRange()).set(uvs);
    uvBuffer.unmap();

    // Extracting indices
    const indices = geometry.index!.array;
    const indexBuffer = device.createBuffer({
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
    });
    new Uint16Array(indexBuffer.getMappedRange()).set(indices);
    indexBuffer.unmap();

    return { positionBuffer, normalBuffer, uvBuffer, indexBuffer };
}