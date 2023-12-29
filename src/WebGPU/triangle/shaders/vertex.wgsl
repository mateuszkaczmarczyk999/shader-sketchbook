struct VertexInput {
    @location(0) pos: vec3f,
    @location(1) color: vec3f,
    @builtin(instance_index) instance: u32,
};

struct VertexOut {
    @builtin(position) position : vec4f,
    @location(0) color : vec4f
}

@group(0) @binding(0) var<uniform> view: mat4x4<f32>;
@group(0) @binding(1) var<uniform> projection: mat4x4<f32>;


@vertex
fn vertexMain(input: VertexInput) -> VertexOut {
    var output : VertexOut;
    output.position = projection * view * vec4(input.pos, 1.0);
    output.color = vec4f(input.color, 1.0);
    return output;
}
