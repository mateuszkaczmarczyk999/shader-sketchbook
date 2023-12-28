import { Renderer } from "../types/rendering.ts";
import { WebGLUtils } from "./utils.ts";
import {
    Camera,
    Color,
    Mesh,
    Scene,
    ShaderMaterial,
    WebGLRenderer
} from "three";
import { createBufferGeometry } from "./lighting-models/geometry.ts";
import vertexShaderSource from "./lighting-models/shaders/vertex.glsl?raw";
import fragmentShaderSource from "./lighting-models/shaders/fragment.glsl?raw";

export class ThreeRenderer implements Renderer {
    engine!: WebGLRenderer;
    scene!: Scene;
    camera!: Camera;

    initialize = async () => {
        this.engine = new WebGLRenderer({
            antialias: true,
            canvas: WebGLUtils.getCanvasElement(),
            precision: "highp",
            powerPreference: "high-performance",
        });
        this.engine.setClearColor(new Color(0.8, 0.8, 0.8), 1.0);

        this.scene = new Scene();

        this.camera = WebGLUtils.getCamera('perspective');

        this.scene.background = WebGLUtils.getEnvironmentTexture();

        this.prepareModel();
    }

    prepareModel = async () => {
        const shaderMaterial = new ShaderMaterial({
            uniforms: {
                specMap: { value: this.scene.background }
            },
            vertexShader: vertexShaderSource,
            fragmentShader: fragmentShaderSource,
        });

        const geometry = createBufferGeometry();

        const plane = new Mesh(geometry, shaderMaterial);
        plane.position.set(0, 0, 0);

        this.scene.add(plane);
    }

    draw = () => {
        setTimeout(() => {
            this.engine.render(this.scene, this.camera);
        }, 1000);
    }
}