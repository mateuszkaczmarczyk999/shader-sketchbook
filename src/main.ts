// import { WebGPURenderer } from "./WebGPU/renderer.ts";
import { ThreeRenderer } from "./WebGL/renderer.ts";

const renderer = new ThreeRenderer();

renderer.initialize().then(() => {
    renderer.draw();
});