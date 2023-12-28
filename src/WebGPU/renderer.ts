import { Renderer } from "../types/rendering.ts";
import { WebGPUUtils } from "./utils.ts";
import vertexShaderSource from "./shaders/triangle/vertex.wgsl?raw";
import fragmentShaderSource from "./shaders/triangle/fragment.wgsl?raw";

export class WebGPURenderer implements Renderer {
    private context!: GPUCanvasContext;
    private device!: GPUDevice;
    private pipeline!: GPURenderPipeline;

    initialize = async () => {
        this.context = WebGPUUtils.getCanvasContext();
        const adapter = await WebGPUUtils.getGPUAdapter();
        this.device = await adapter.requestDevice();

        this.context.configure({
            device: this.device,
            format: WebGPUUtils.getPreferredCanvasFormat(),
        });

        this.prepareModel();
    }

    prepareModel = () => {
        const vertexShaderModule = this.device.createShaderModule({
            code: vertexShaderSource
        });

        const vertexState: GPUVertexState = {
            module: vertexShaderModule,
            entryPoint: "vertexMain",
            buffers: []
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
        passEncoder.draw(3);

        passEncoder.end();

        this.device.queue.submit([
            commandEncoder.finish()
        ]);
    }
}