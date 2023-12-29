import { Renderer } from "../types/rendering.ts";
import { WebGPUUtils } from "./utils.ts";
import vertexShaderSource from "./triangle/shaders/vertex.wgsl?raw";
import fragmentShaderSource from "./triangle/shaders/fragment.wgsl?raw";
import { Triangle } from "./triangle/geometry.ts";

export class WebGPURenderer implements Renderer {
    private context!: GPUCanvasContext;
    private device!: GPUDevice;
    private pipeline!: GPURenderPipeline;

    private _triangle!: Triangle;

    // private depthTexture!: GPUTexture;
    // private depthTextureView!: GPUTextureView;

    initialize = async () => {
        this.context = WebGPUUtils.getCanvasContext();
        const adapter = await WebGPUUtils.getGPUAdapter();
        this.device = await adapter.requestDevice();

        this.context.configure({
            device: this.device,
            format: WebGPUUtils.getPreferredCanvasFormat(),
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
        });

        this.prepareModel();
    }

    prepareModel = () => {
        // const geometry = createBufferGeometry(this.device);
        // this.device.queue.writeBuffer(geometry.vertexBuffer, 0, geometry.vertices);

        this._triangle = new Triangle(this.device);

        const positionAttribDesc: GPUVertexAttribute = {
            shaderLocation: 0, // @location(0)
            offset: 0,
            format: 'float32x3'
        };
        const colorAttribDesc: GPUVertexAttribute = {
            shaderLocation: 1, // @location(1)
            offset: 0,
            format: 'float32x3'
        };

        const positionBufferDesc: GPUVertexBufferLayout = {
            attributes: [positionAttribDesc],
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex'
        };
        const colorBufferDesc: GPUVertexBufferLayout = {
            attributes: [colorAttribDesc],
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex'
        };

        const vertexShaderModule = this.device.createShaderModule({
            code: vertexShaderSource
        });

        const vertexState: GPUVertexState = {
            module: vertexShaderModule,
            entryPoint: "vertexMain",
            buffers: [ positionBufferDesc, colorBufferDesc ]
        };

        const fragmentShaderModule = this.device.createShaderModule({
            code: fragmentShaderSource
        });

        const fragmentState: GPUFragmentState = {
            module: fragmentShaderModule,
            entryPoint: "fragmentMain",
            targets: [ { format: WebGPUUtils.getPreferredCanvasFormat() } ]
        };

        this.pipeline = this.device.createRenderPipeline({
            vertex: vertexState,
            fragment: fragmentState,
            primitive: { topology: "triangle-list" },
            layout: "auto",
        });
    }


    draw = () => {
        const commandEncoder = this.device.createCommandEncoder();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    clearValue: { r: 0.8, g: 0.8, b: 0.8, a: 1.0 },
                    loadOp: "clear",
                    storeOp: "store",
                    view: this.context.getCurrentTexture().createView()
                }
            ]
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

        passEncoder.setPipeline(this.pipeline);
        passEncoder.setVertexBuffer(0, this._triangle.getVertexBuffer());
        passEncoder.setVertexBuffer(1, this._triangle.getColorBuffer());
        passEncoder.setIndexBuffer(this._triangle.getIndexBuffer(), 'uint16');
        passEncoder.drawIndexed(3);

        passEncoder.end();

        this.device.queue.submit([
            commandEncoder.finish()
        ]);
    }
}