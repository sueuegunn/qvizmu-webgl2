#version 300 es
precision mediump float;

in vec3 a_position;
in vec2 a_uv;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec2 v_uv;

void main() {
  v_uv = a_uv;
  gl_Position = projection * view * model * vec4(a_position, 1.0);
}
