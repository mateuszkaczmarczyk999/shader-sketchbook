export namespace WebGPUUtils {
    export const getCanvasElement = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (!canvas) throw new Error('Canvas element not found');
        return canvas;
    }
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
