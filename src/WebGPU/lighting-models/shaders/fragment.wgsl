struct VertexOut {
    @builtin(position) proj_position : vec4f,
    @location(0) vNormal : vec3f,
    @location(1) vPosition : vec3f,
}

@group(0) @binding(3) var<uniform> cameraPosition: vec3f;

fn inverseLerp(v: f32, minValue: f32, maxValue: f32) -> f32 {
    return (v - minValue) / (maxValue - minValue);
}

fn remap(v: f32, inMin: f32, inMax: f32, outMin: f32, outMax: f32) -> f32 {
    var t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

fn gammaCorrection(value: vec3f) -> vec3f {
    return pow(value, vec3(1.0 / 2.2));
}

@fragment
fn fragmentMain(fragData: VertexOut) -> @location(0) vec4f {
    var baseColour = vec3(0.5, 0.05, 0.05);
    var normal = normalize(fragData.vNormal);
    var viewDir = normalize(cameraPosition - fragData.vPosition);

    var lighting = vec3(0.0);

    // Ambient
    var ambient = vec3(0.5);

    // Hemisphere
    var skyColour = vec3(0.0, 0.3, 0.6);
    var groundColour = vec3(0.6, 0.3, 0.1);
    var hemiVal = remap(normal.y, -1.0, 1.0, 0.0, 1.0);
    var hemiLight = mix(groundColour, skyColour, hemiVal);

    // Diffuse
    var lightDir = normalize(vec3(1.0));
    var lightCol = vec3(1.0, 1.0, 0.9);
    var proportion = max(0.0, dot(lightDir, normal));
    var diffuse = proportion * lightCol;

    // Phong specular
    var reflectDir = normalize(reflect(-lightDir, normal));
    var phongValue = max(0.0, dot(viewDir, reflectDir));
    phongValue = pow(phongValue, 64.0);
    var specular = vec3(phongValue);

    // Frensel specular
    var frensel = 1.0 - max(0.0, dot(viewDir, normal));
    frensel = pow(frensel, 1.1);
    specular *= frensel;

    lighting = ambient * 0.0 + hemiLight * 1.2 + diffuse * 0.8;

    var colour = baseColour * lighting + specular;

    colour = gammaCorrection(colour);

    return vec4(colour, 1.0);
}
