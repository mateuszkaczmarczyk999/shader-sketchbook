struct VertexInput {
    @location(0) pos: vec3f,
    @location(1) normal: vec3f,
    @location(2) uv: vec3f,
    @builtin(instance_index) instance: u32,
};

struct VertexOut {
    @builtin(position) proj_position : vec4f,
    @location(0) vNormal : vec3f,
    @location(1) vPosition : vec3f,
}

@group(0) @binding(0) var<uniform> view: mat4x4<f32>;
@group(0) @binding(1) var<uniform> projection: mat4x4<f32>;
@group(0) @binding(2) var<uniform> modelMatrix: mat4x4<f32>;

@vertex
fn vertexMain(input: VertexInput) -> VertexOut {
    var output : VertexOut;
    output.proj_position = projection * view * vec4(input.pos, 1.0);
    output.vNormal = (modelMatrix * vec4(input.normal, 0.0)).xyz;
    output.vPosition = (modelMatrix * vec4(input.pos, 1.0)).xyz;
    return output;
}
