const positions = new Float32Array([
     1.0, -1.0,  0.0,
    -1.0, -1.0,  0.0,
     0.0,  1.0,  0.0
]);

const colors = new Float32Array([
     1.0,  0.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  0.0,  1.0,
]);

const indices = new Uint16Array([ 0, 1, 2 ]);

export class Triangle {
    private device!: GPUDevice;

    private readonly positionBuffer!: GPUBuffer;
    private readonly colorBuffer!: GPUBuffer;
    private readonly indexBuffer!: GPUBuffer;

    constructor(device: GPUDevice) {
        this.device = device;

        this.positionBuffer = this.createBuffer(positions, GPUBufferUsage.VERTEX);
        this.colorBuffer = this.createBuffer(colors, GPUBufferUsage.VERTEX);
        this.indexBuffer = this.createBuffer(indices, GPUBufferUsage.INDEX);
    }

    public getVertexBuffer = () => this.positionBuffer;
    public getColorBuffer = () => this.colorBuffer;
    public getIndexBuffer = () => this.indexBuffer;

    private createBuffer = (arr: Float32Array | Uint16Array, usage: number) => {
        const descriptor: GPUBufferDescriptor = {
            label: "Triangle vertices",
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