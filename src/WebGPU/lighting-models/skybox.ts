export const cubeVertexSize = 4 * 10; // Byte size of one cube vertex.
export const cubePositionOffset = 0;
export const cubeColorOffset = 4 * 4; // Byte offset of cube vertex color attribute.
export const cubeUVOffset = 4 * 8;
export const cubeVertexCount = 36;

// prettier-ignore
export const cubeVertexArray = new Float32Array([
    // float4 position, float4 color, float2 uv,
    1, -1, 1, 1,   1, 0, 1, 1,  0, 1,
    -1, -1, 1, 1,  0, 0, 1, 1,  1, 1,
    -1, -1, -1, 1, 0, 0, 0, 1,  1, 0,
    1, -1, -1, 1,  1, 0, 0, 1,  0, 0,
    1, -1, 1, 1,   1, 0, 1, 1,  0, 1,
    -1, -1, -1, 1, 0, 0, 0, 1,  1, 0,

    1, 1, 1, 1,    1, 1, 1, 1,  0, 1,
    1, -1, 1, 1,   1, 0, 1, 1,  1, 1,
    1, -1, -1, 1,  1, 0, 0, 1,  1, 0,
    1, 1, -1, 1,   1, 1, 0, 1,  0, 0,
    1, 1, 1, 1,    1, 1, 1, 1,  0, 1,
    1, -1, -1, 1,  1, 0, 0, 1,  1, 0,

    -1, 1, 1, 1,   0, 1, 1, 1,  0, 1,
    1, 1, 1, 1,    1, 1, 1, 1,  1, 1,
    1, 1, -1, 1,   1, 1, 0, 1,  1, 0,
    -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,
    -1, 1, 1, 1,   0, 1, 1, 1,  0, 1,
    1, 1, -1, 1,   1, 1, 0, 1,  1, 0,

    -1, -1, 1, 1,  0, 0, 1, 1,  0, 1,
    -1, 1, 1, 1,   0, 1, 1, 1,  1, 1,
    -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,
    -1, -1, -1, 1, 0, 0, 0, 1,  0, 0,
    -1, -1, 1, 1,  0, 0, 1, 1,  0, 1,
    -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,

    1, 1, 1, 1,    1, 1, 1, 1,  0, 1,
    -1, 1, 1, 1,   0, 1, 1, 1,  1, 1,
    -1, -1, 1, 1,  0, 0, 1, 1,  1, 0,
    -1, -1, 1, 1,  0, 0, 1, 1,  1, 0,
    1, -1, 1, 1,   1, 0, 1, 1,  0, 0,
    1, 1, 1, 1,    1, 1, 1, 1,  0, 1,

    1, -1, -1, 1,  1, 0, 0, 1,  0, 1,
    -1, -1, -1, 1, 0, 0, 0, 1,  1, 1,
    -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,
    1, 1, -1, 1,   1, 1, 0, 1,  0, 0,
    1, -1, -1, 1,  1, 0, 0, 1,  0, 1,
    -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,
]);

let verticesBuffer: GPUBuffer;

export const createVerticesBuffer = (device: GPUDevice) => {
    verticesBuffer = device.createBuffer({
        size: cubeVertexArray.byteLength,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    });
    new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
    verticesBuffer.unmap();

    return verticesBuffer;
}

export const getSkyBoxVerticesBuffer = () => verticesBuffer;

