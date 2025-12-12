#version 300 es
precision mediump float;

uniform vec4 color;

out vec4 fragmentColor;

void main() {
  // fragmentColor = color + vec4(1.0, 1.0, 1.0, 1.0);
  fragmentColor = color;
}
