import { mergeOptions } from "Util";
import { mat4 } from "gl-matrix";
import cfg from "Config";
import Drawable from "Drawable";

("use strict");
export default Geometry;

/**
 * @constructor
 * @extends Drawable
 *
 * @description Base class for objects describing webGl geometry. All geometry is stored in a circular buffer.
 * Buffer size is fixed on construction
 *
 * Handy-Dandy Glossary:
 *  A vertex is composed of three coordinates
 *  A coordinate is the component of a vertex in a single axis
 *  Length refers to the number of elements in an array
 *  Size refers to byte length of a buffer
 *  Index refers to the index of an element in an array
 *  Offset refers to byte location in a buffer
 *
 * Note that for 8bit buffers, index and offset, size and length, will both refer to the same location and capacity,
 * but the terminology should remain consistent regardless.
 */
function Geometry(userOptions) {
  /**
   * @typedef Geometry.Options
   */
  let options = mergeOptions(
    {
      origin: [
        0,
        0
      ] /* Fraction of the drawable to start rendering the lines in */,
      size: [1, 1] /* Size of the drawable  */,
      coordBufferLength: 512
    },
    userOptions
  );

  this._coordBuffer = null;
  this._coordBufferLength = options.coordBufferLength;
  this._coordCache = new Float32Array(120);
  this._numCoords = 0;
  this._buffersDirty = true;
  this._mvMatrix = mat4.create();
  this._pMatrix = mat4.create();
  this.numVertices = 0;
  this._lastCoordIndex = 0;
  this._unAllocated = true;

  Drawable.call(this, options);

  this.setCamera(options.origin, options.size);
}

Geometry.prototype = Object.assign(Object.create(Drawable.prototype), {
  setCamera(origin, size, near = 0, far = 1) {
    mat4.ortho(
      this._pMatrix,
      origin[0] /* left */,
      origin[0] + size[0] /* right */,
      origin[1] /* bottom */,
      origin[1] + size[1] /* top */,
      0 /* near */,
      1 /* far */
    );
  },
  /**
   * @memberof Geometry
   * @instance
   * @description
   * Add vertices to this geometry object
   * @param {Float[]} coords Packed array of floating point coordinats. (e.g. [x1,y1,z1,x2,y2,z2,...xn,yn,zn])
   */
  addVertices: function(coords) {
    if (this._numCoords >= this._coordCache.length - coords.length) {
      let oldCache = this._coordCache;

      let newSize = (this._coordCache.length + coords.length) * 1.125;
      newSize = newSize + (newSize % cfg.COORDS_PER_VERT);

      this._coordCache = new Float32Array(newSize);
      this._coordCache.set(oldCache);
    }

    this._coordCache.set(coords, this._numCoords);
    this._numCoords += coords.length;
    this._buffersDirty = true;
  },

  initGl: function(gl) {
    if (this._unAllocated) {
      this._coordBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, this._coordBuffer);
      let initialSize = Math.max(this._numCoords, this._coordBufferLength);
      this._coordBufferLength = initialSize;

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(initialSize),
        gl.STATIC_DRAW
      );
      this._unAllocated = false;
    }

    if (this._numCoords) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this._coordBuffer);
      let remainingLength = this._coordBufferLength - this._lastCoordIndex;

      if (remainingLength < this._numCoords) {
        /* new verts would overflow buffer */
        if (remainingLength) {
          gl.bufferSubData(
            gl.ARRAY_BUFFER,
            this._lastCoordIndex * Float32Array.BYTES_PER_ELEMENT,
            this._coordCache.subarray(0, remainingLength)
          );
        }

        gl.bufferSubData(
          gl.ARRAY_BUFFER,
          0,
          this._coordCache.subarray(remainingLength, this._numCoords)
        );
        this._lastCoordIndex = this._numCoords - remainingLength;
      } else {
        gl.bufferSubData(
          gl.ARRAY_BUFFER,
          this._lastCoordIndex * Float32Array.BYTES_PER_ELEMENT,
          this._coordCache.subarray(0, this._numCoords)
        );
        this._lastCoordIndex += this._numCoords;
      }

      this.numVertices = Math.min(
        this.numVertices + this._numCoords / cfg.COORDS_PER_VERT,
        parseInt(this._coordBufferLength / cfg.COORDS_PER_VERT)
      );

      this._numCoords = 0;
    }
  },

  /**
   * @memberof Geometry
   * @instance
   * @description
   * Base draw method, which should always be called by subclasses. This method will perform any updates to dirty
   * geometry buffers, but does not actually perform any drawing itself.
   */
  draw: function(gl) {
    if (this._buffersDirty) {
      this.initGl(gl);
      this._buffersDirty = false;
    }
  },

  /**
   * @memberof Geometry
   * @instance
   * @description
   * Draws the circular buffer as a line strip,
   */
  drawCircular(gl) {
    if (
      this._lastCoordIndex &&
      this.numVertices ==
        parseInt(this._coordBufferLength / cfg.COORDS_PER_VERT)
    ) {
      let lastVertexIndex = this._lastCoordIndex / cfg.COORDS_PER_VERT;
      let vertsToDraw = this.numVertices - lastVertexIndex;

      if (vertsToDraw) {
        gl.drawArrays(gl.LINE_STRIP, lastVertexIndex, vertsToDraw);
      }

      gl.drawArrays(gl.LINE_STRIP, 0, lastVertexIndex);
    } else {
      gl.drawArrays(gl.LINE_STRIP, 0, this.numVertices);
    }
  },

  /**
   * @memberof Geometry
   * @instance
   * @description
   * Set up a vertex shader's modelView and projection matrixes, and assign the position of the vertex buffer for this
   * geometry.
   *
   * @param {WebGl} gl Webgl context
   * @param {Shader} shader Shader instance
   */
  setShaderPosition: function(gl, shader) {
    shader.use(gl, this._mvMatrix, this._pMatrix);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._coordBuffer);
    gl.enableVertexAttribArray(shader.vertexPositionAttribute);
    gl.vertexAttribPointer(
      shader.vertexPositionAttribute,
      cfg.COORDS_PER_VERT,
      gl.FLOAT,
      false,
      0,
      0
    );
  }
});
