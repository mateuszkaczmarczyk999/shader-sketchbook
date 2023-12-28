import { CubeTextureLoader, OrthographicCamera, PerspectiveCamera, Vector2 } from "three";

export namespace WebGLUtils {
    const _canvasSize = new Vector2(0, 0);
    const _cubeLoader = new CubeTextureLoader();
    export const getCanvasElement = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (!canvas) throw new Error('Canvas element not found');
        _canvasSize.set(canvas.width, canvas.height);
        return canvas;
    }
    export const getCanvasSize = () => _canvasSize;
    export const getAspectRatio = () => _canvasSize.x / _canvasSize.y;
    export const getCamera = (type: 'perspective' | 'orthographic') => {
        switch (type) {
            case 'perspective':
                const perspectiveCamera = new PerspectiveCamera(60, WebGLUtils.getAspectRatio(), 0.1, 1000.0);
                perspectiveCamera.position.set(0, 0, 4);
                return perspectiveCamera;
            case 'orthographic':
                const orthographicCamera = new OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
                orthographicCamera.position.set(0, 0, 1);
                return orthographicCamera
            default:
                throw new Error('Unknown camera type');
        }
    };
    export const getEnvironmentTexture = () => {
        const texture = _cubeLoader.load([
            '../../resources/Cold_Sunset__Cam_2_Left+X.png',
            '../../resources/Cold_Sunset__Cam_3_Right-X.png',
            '../../resources/Cold_Sunset__Cam_4_Up+Y.png',
            '../../resources/Cold_Sunset__Cam_5_Down-Y.png',
            '../../resources/Cold_Sunset__Cam_0_Front+Z.png',
            '../../resources/Cold_Sunset__Cam_1_Back-Z.png',
        ]);
        return texture;
    };
}