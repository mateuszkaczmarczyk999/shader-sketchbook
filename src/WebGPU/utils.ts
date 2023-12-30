import {CubeTexture, CubeTextureLoader, Vector2} from "three";

export namespace WebGPUUtils {
    const _canvasSize = new Vector2(0, 0);
    const _cubeLoader = new CubeTextureLoader();
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

    export const getEnvironmentTexture = () => {
        return new Promise<CubeTexture>(resolve => {
            const texture = _cubeLoader.load([
                '../../resources/Cold_Sunset__Cam_2_Left+X.png',
                '../../resources/Cold_Sunset__Cam_3_Right-X.png',
                '../../resources/Cold_Sunset__Cam_4_Up+Y.png',
                '../../resources/Cold_Sunset__Cam_5_Down-Y.png',
                '../../resources/Cold_Sunset__Cam_0_Front+Z.png',
                '../../resources/Cold_Sunset__Cam_1_Back-Z.png',
            ]);
            setTimeout(() => {
                resolve(texture);
            }, 2000);
        });
    };

    export const getImageData = (image: any) => {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);

        return context.getImageData(0, 0, image.width, image.height).data;
    }
}
