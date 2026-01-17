#version 300 es
precision mediump float;

in vec2 v_uv;

uniform sampler2D u_colorMap;

out vec4 outColor;

void main() {
  vec4 pixel = texture(u_colorMap, v_uv);
  if (pixel.a <= 0.2) {
    discard;
  }
  outColor = vec4(pixel.rgb / pixel.a, pixel.a);
}
