import { Renderer } from "../types/rendering.ts";
import { WebGPUUtils } from "./utils.ts";
import vertexShaderSource from "./triangle/shaders/vertex.wgsl?raw";
import fragmentShaderSource from "./triangle/shaders/fragment.wgsl?raw";
import { Triangle } from "./triangle/geometry.ts";
import {mat4, ReadonlyVec3} from 'gl-matrix';

export class WebGPURenderer implements Renderer {
    private context!: GPUCanvasContext;
    private device!: GPUDevice;
    private pipeline!: GPURenderPipeline;

    private _triangle!: Triangle;
    private _viewParametersBindGroup!: GPUBindGroup;

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

    prepareCameraProjection = (fov: number, aspect: number, near: number, far: number) => {
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fov, aspect, near, far);
        return projectionMatrix;
    }

    prepareCameraView = (eye: ReadonlyVec3, center: ReadonlyVec3, up: ReadonlyVec3) => {
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, eye, center, up);
        return viewMatrix;
    }

    prepareModel = () => {
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

        // bind group layout
        const viewUniformBindGroupLayout: GPUBindGroupLayoutEntry = {
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: { type: 'uniform' }
        };

        const projectionUniformBindGroupLayout: GPUBindGroupLayoutEntry = {
            binding: 1,
            visibility: GPUShaderStage.VERTEX,
            buffer: { type: 'uniform' }
        };

        const bindGroupLayout: GPUBindGroupLayout = this.device.createBindGroupLayout({
            entries: [ viewUniformBindGroupLayout, projectionUniformBindGroupLayout ]
        });

        const pipelineLayoutDesc: GPUPipelineLayoutDescriptor = {
            bindGroupLayouts: [ bindGroupLayout ]
        };

        const layout = this.device.createPipelineLayout(pipelineLayoutDesc);

        const viewParametersUniformBuffer: GPUBuffer = this.device.createBuffer({
            size: 4 * 16, // sizeof(float) * 16
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const projectionParametersUniformBuffer: GPUBuffer = this.device.createBuffer({
            size: 4 * 16, // sizeof(float) * 16
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const viewParametersBindGroupEntry: GPUBindGroupEntry = {
            binding: 0,
            resource: { buffer: viewParametersUniformBuffer }
        };

        const projectionParametersBindGroupEntry: GPUBindGroupEntry = {
            binding: 1,
            resource: { buffer: projectionParametersUniformBuffer }
        };

        this._viewParametersBindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                viewParametersBindGroupEntry,
                projectionParametersBindGroupEntry
            ]
        });

        // camera setup
        const viewMatrix = this.prepareCameraView([1, 1, 5], [0, 0, 0], [0, 1, 0]);
        const viewMatrixFlatten = new Float32Array(16);
        viewMatrixFlatten.set(viewMatrix);
        this.device.queue.writeBuffer(viewParametersUniformBuffer, /*bufferOffset=*/0, viewMatrixFlatten);

        const projectionMatrix = this.prepareCameraProjection(Math.PI / 4, 1, 0.1, 1000);
        const projectionMatrixFlatten = new Float32Array(16);
        projectionMatrixFlatten.set(projectionMatrix);
        this.device.queue.writeBuffer(projectionParametersUniformBuffer, /*bufferOffset=*/0, projectionMatrixFlatten);

        // pipeline
        this.pipeline = this.device.createRenderPipeline({
            vertex: vertexState,
            fragment: fragmentState,
            primitive: { topology: "triangle-list" },
            layout,
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
        passEncoder.setBindGroup(0, this._viewParametersBindGroup);
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