import { Vector2 } from "three";

export namespace WebGPUUtils {
    const _canvasSize = new Vector2(0, 0);
    export const getCanvasElement = () => {
        const _canvasSize = new Vector2(0, 0);
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (!canvas) throw new Error('Canvas element not found');
        _canvasSize.set(canvas.width, canvas.height);
        return canvas;
    }
    export const getCanvasSize = () => _canvasSize;
    export const getAspectRatio = () => _canvasSize.x / _canvasSize.y;
    export const getCanvasContext = () => {
        const context = getCanvasElement().getContext('webgpu') as GPUCanvasContext;
        if (!context) throw new Error('WebGPU is not supported');
        return context;
    }

    export const getGPUAdapter = async () => {
        const adapter = await navigator.gpu.requestAdapter() as GPUAdapter;
        if (!adapter) throw new Error('WebGPU is not supported');
        return adapter;
    };

    export const getPreferredCanvasFormat = () => navigator.gpu.getPreferredCanvasFormat() as GPUTextureFormat;
}
