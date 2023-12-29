struct VertexInput {
    @location(0) pos: vec3f,
    @location(1) color: vec3f,
    @builtin(instance_index) instance: u32,
};

struct VertexOut {
    @builtin(position) position : vec4f,
    @location(0) color : vec4f
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOut {

    var output : VertexOut;
    output.position = vec4f(input.pos, 1.0);
    output.color = vec4f(input.color, 1.0);
    return output;
}
