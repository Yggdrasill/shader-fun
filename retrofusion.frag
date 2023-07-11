#define ITER 16.0

vec3 palette(float t)
{
    vec3 a = vec3(1.500,0.500,1);
    vec3 b = vec3(1.000,0.500,1.000);
    vec3 c = vec3(1.000,0.500,1.000);
    vec3 d = vec3(1.000,0.750,0.500);

    return a * b * cos(6.28318 * (c * t + d) );
}

float scanlines(vec2 uv)
{
    float scanline;

    scanline = cos(uv.y * iResolution.y * 8.0) * sin(uv.y * iResolution.y * 8.0);
    scanline = scanline + sin(iTime * 100.0) * 0.1;
    scanline *= 0.33;

    return scanline;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    vec2 uv0 = uv;
    float d;
    vec3 col;
    float scanline;
    vec3 final = vec3(0.0);
    float angle = iTime * 0.25;
    for(float i = 0.0; i < ITER; i++) {
        uv = abs(uv);
        uv -= 0.5;
        uv = uv * 1.618;
        uv *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        d = length(uv * abs(tan(iTime * 0.01))) - 1.5;
        d = abs(d) * 2.718281828459 * uv.x;
        col = palette(tan(d) * cos(uv0.x) * cos(uv0.y));
        scanline = scanlines(uv0);
        col = mix(col, vec3(scanline), scanline);
        col = smoothstep(0.0, d, col);
        d = tan(d / 1.618 - iTime * 0.25);
        final += col * d;
    }
    final /= (ITER * 0.5);
    // Output to screen
    fragColor = vec4(final, 1.0);
}
