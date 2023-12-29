struct VertexOut {
    @builtin(position) proj_position : vec4f,
    @location(0) vNormal : vec3f,
    @location(1) vPosition : vec3f,
}

@fragment
fn fragmentMain(fragData: VertexOut) -> @location(0) vec4f {
    var normal = normalize(fragData.vNormal);
    return vec4(normal, 1.0);
}
