varying vec3 vNormal;
varying vec3 vPosition;
uniform samplerCube specMap;

float inverseLerp(float v, float minValue, float maxValue) {
    return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

vec3 linearTosRGB(vec3 value) {
    vec3 lt = vec3(lessThanEqual(value.rgb, vec3(0.0031308)));

    vec3 v1 = value * 12.92;
    vec3 v2 = pow(value.xyz, vec3(0.41666)) * 1.055 - vec3(0.055);

    return mix(v2, v1, lt);
}

vec3 gammaCorrection(vec3 value) {
    return pow(value, vec3(1.0 / 2.2));
}

void main() {
    vec3 baseColour = vec3(0.5, 0.05, 0.05);
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);

    vec3 lighting = vec3(0.0);

    // Ambient
    vec3 ambient = vec3(0.5);

    // Hemisphere
    vec3 skyColour = vec3(0.0, 0.3, 0.6);
    vec3 groundColour = vec3(0.6, 0.3, 0.1);
    float hemiVal = remap(normal.y, -1.0, 1.0, 0.0, 1.0);
    vec3 hemiLight = mix(groundColour, skyColour, hemiVal);

    // Diffuse
    vec3 lightDir = normalize(vec3(1.0));
    vec3 lightCol = vec3(1.0, 1.0, 0.9);
    float proportion = max(0.0, dot(lightDir, normal));
    vec3 diffuse = proportion * lightCol;

    // Phong specular
    vec3 reflectDir = normalize(reflect(-lightDir, normal));
    float phongValue = max(0.0, dot(viewDir, reflectDir));
    phongValue = pow(phongValue, 64.0);
    vec3 specular = vec3(phongValue);

    // IBL specular
    vec3 iblCoord = normalize(reflect(-viewDir, normal));
    vec3 iblSample = textureCubeLodEXT(specMap, iblCoord,8.0).xyz;
    specular += iblSample * 0.5;

    // Frensel specular
    float frensel = 1.0 - max(0.0, dot(viewDir, normal));
    frensel = pow(frensel, 1.1);
    specular *= frensel;

    // Light accumulation
    lighting = ambient * 0.0 + hemiLight * 0.2 + diffuse * 0.8;

    // Final colour
    vec3 colour = baseColour * lighting + specular;

    // Color correction
    colour = gammaCorrection(colour);

    gl_FragColor = vec4(colour, 1.0);
}