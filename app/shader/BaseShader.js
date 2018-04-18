import {mat4} from "gl-matrix";

export default function BaseShader() {
  this._color = [0.0,0.0,0.0,1.0];
}

BaseShader.prototype = {

  _createShader : function (gl, type, str) {
    let shader = gl.createShader(type);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }

    return shader;
  },

  getVertexShader : function () {
    return `
      attribute vec3 aVertexPosition;

      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;

      void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
      }
    `;
  },

  getFragmentShader : function () {
   return `
      precision mediump float;
      uniform vec4 uFragColor;

      void main(void) {
        gl_FragColor = uFragColor;
      }
    `;
  },

  initGl : function (gl) {

    let fShader = this._createShader(gl, gl.FRAGMENT_SHADER, this.getFragmentShader());
    let vShader = this._createShader(gl, gl.VERTEX_SHADER, this.getVertexShader());

    this.program = gl.createProgram();
    gl.attachShader(this.program, vShader);
    gl.attachShader(this.program, fShader);

    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getShaderInfoLog(this.program));
    }

    this.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
    this.uPMatrix = gl.getUniformLocation(this.program, "uPMatrix");
    this.uMVMatrix = gl.getUniformLocation(this.program, "uMVMatrix");
    this.uFragColor = gl.getUniformLocation(this.program, "uFragColor");

  },

  color : function (gl, vec4) {
    this._color = vec4;
    gl.uniform4fv(this.uFragColor, vec4);
  },

  use : function (gl, mvMatrix, pMatrix) {
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uPMatrix, false, pMatrix);
    gl.uniformMatrix4fv(this.uMVMatrix, false, mvMatrix);
    this.color(gl, this._color);
  },
}
