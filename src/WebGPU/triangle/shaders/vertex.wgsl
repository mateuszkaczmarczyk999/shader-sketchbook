struct VertexOut {
    @builtin(position) position : vec4f,
    @location(0) color : vec4f
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOut {

    let pos = array(
        vec2f( 0.0,  0.5),
        vec2f(-0.5, -0.5),
        vec2f( 0.5, -0.5)
    );

    var output : VertexOut;
    output.position = vec4f(pos[vertexIndex].x, pos[vertexIndex].y, 0.0, 1.0);
    output.color = vec4f(1.0, 0.0, 0.0, 1.0);
    return output;
}
