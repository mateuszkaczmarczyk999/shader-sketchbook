import { Vector2 } from "three";

export namespace WebGLUtils {
    const _canvasSize = new Vector2(0, 0);
    export const getCanvasElement = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (!canvas) throw new Error('Canvas element not found');
        _canvasSize.set(canvas.width, canvas.height);
        return canvas;
    }
    export const getCanvasSize = () => _canvasSize;
}