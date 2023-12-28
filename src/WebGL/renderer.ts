import { Renderer } from "../types/rendering.ts";
import { WebGLUtils } from "./utils.ts";
import {
    BufferAttribute, BufferGeometry,
    Color,
    Mesh,
    OrthographicCamera,
    Scene,
    ShaderMaterial,
    WebGLRenderer
} from "three";
import vertexShaderSource from "./shaders/triangle/vertex.glsl?raw";
import fragmentShaderSource from "./shaders/triangle/fragment.glsl?raw";

export class ThreeRenderer implements Renderer {
    engine!: WebGLRenderer;
    scene!: Scene;
    camera!: OrthographicCamera;

    initialize = async () => {
        this.engine = new WebGLRenderer({
            antialias: true,
            canvas: WebGLUtils.getCanvasElement(),
            precision: "highp",
            powerPreference: "high-performance",
        });
        this.engine.setClearColor(new Color(0.8, 0.8, 0.8), 1.0);

        this.scene = new Scene();

        this.camera = new OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
        this.camera.position.set(0, 0, 1);

        this.prepareModel();
    }

    prepareModel = () => {
        const shaderMaterial = new ShaderMaterial({
            uniforms: {
                resolution: { value: WebGLUtils.getCanvasSize() }
            },
            vertexShader: vertexShaderSource,
            fragmentShader: fragmentShaderSource,
        });

        const vertices = new Float32Array([
            0.0,  0.5,  0.0,  // top center
            -0.5, -0.5,  0.0,  // bottom left
            0.5, -0.5,  0.0   // bottom right
        ]);

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(vertices, 3));

        const plane = new Mesh(geometry, shaderMaterial);
        plane.position.set(0.5, 0.5, 0);
        this.scene.add(plane);
    }

    draw = () => {
        this.engine.render(this.scene, this.camera);
    }
}