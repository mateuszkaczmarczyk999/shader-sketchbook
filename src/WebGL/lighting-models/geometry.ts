import { SphereGeometry } from "three";

export const createBufferGeometry = () => {
    return new SphereGeometry(1, 32, 32);
}