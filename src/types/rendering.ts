export interface Renderer {
    initialize: () => Promise<void>;
    draw: () => void;
}