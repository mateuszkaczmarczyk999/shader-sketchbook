import { SphereGeometry } from "three";
import { mat4, quat, vec3 } from "gl-matrix";

export class Sphere {
    private device!: GPUDevice;

    private readonly positionBuffer!: GPUBuffer;
    private readonly normalBuffer!: GPUBuffer;
    private readonly uvBuffer!: GPUBuffer;
    private readonly indexBuffer!: GPUBuffer;
    private readonly indexCount: number;

    public position = vec3.fromValues(0.0, 0.0, 0.0);
    public rotation = quat.create();
    public scale = vec3.fromValues(1.0, 1.0, 1.0);

    constructor(device: GPUDevice) {
        this.device = device;

        const geometry = new SphereGeometry(1, 32, 32);

        const positions = new Float32Array([ ...geometry.attributes.position.array ]);
        const normals = new Float32Array([ ...geometry.attributes.normal.array ]);
        const uvs = new Float32Array([ ...geometry.attributes.uv.array ]);
        const indices = new Uint16Array([ ...geometry.index!.array ]);

        this.positionBuffer = this.createBuffer(positions, GPUBufferUsage.VERTEX);
        this.normalBuffer = this.createBuffer(normals, GPUBufferUsage.VERTEX);
        this.uvBuffer = this.createBuffer(uvs, GPUBufferUsage.VERTEX);
        this.indexBuffer = this.createBuffer(indices, GPUBufferUsage.INDEX);

        this.indexCount = indices.length;
    }

    public getVertexBuffer = () => this.positionBuffer;
    private getVertexBufferLayout = (): GPUVertexBufferLayout => {
        return {
            attributes: [{
                shaderLocation: 0, // @location(0)
                offset: 0,
                format: 'float32x3'
            }],
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex'
        }
    }
    public getNormalBuffer = () => this.normalBuffer;
    private getNormalBufferLayout = (): GPUVertexBufferLayout => {
        return {
            attributes: [{
                shaderLocation: 1, // @location(1)
                offset: 0,
                format: 'float32x3'
            }],
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex'
        }
    }
    public getUVBuffer = () => this.uvBuffer;
    private getUVBufferLayout = (): GPUVertexBufferLayout => {
        return {
            attributes: [{
                shaderLocation: 2, // @location(2)
                offset: 0,
                format: 'float32x2'
            }],
            arrayStride: 4 * 2, // sizeof(float) * 2
            stepMode: 'vertex'
        }
    }
    public getIndexBuffer = () => this.indexBuffer;
    public getIndexCount = () => this.indexCount;
    public getVertexBufferLayouts = (): GPUVertexBufferLayout[] => [
        this.getVertexBufferLayout(),
        this.getNormalBufferLayout(),
        this.getUVBufferLayout()
    ]

    public getModelMatrix = () => {
        const modelMatrix = mat4.create();
        // mat4.translate(modelMatrix, modelMatrix, this.position);
        // mat4.rotate(modelMatrix, modelMatrix, this.rotation);
        // mat4.scale(modelMatrix, modelMatrix, this.scale);
        return modelMatrix;
    };

    private createBuffer = (arr: Float32Array | Uint16Array, usage: number) => {
        const descriptor: GPUBufferDescriptor = {
            label: "Triangle buffer",
            size: (arr.byteLength + 3) & ~3, // round up to multiple of 4 bytes
            usage,
            mappedAtCreation: true
        };

        const buffer = this.device.createBuffer(descriptor);
        const writeArray =
            arr instanceof Uint16Array
                ? new Uint16Array(buffer.getMappedRange())
                : new Float32Array(buffer.getMappedRange());
        writeArray.set(arr);
        buffer.unmap();

        return buffer;
    }
}