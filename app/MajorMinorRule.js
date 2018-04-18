import {mergeOptions} from "Util";
import BaseShader from "shader/BaseShader";
import Geometry from "Geometry";
import cfg from "Config"

"use strict";

export default MajorMinorRule;

/**
 * @constructor
 * @description A flexible geometry object which can draw grids or rulers
 * @extends Geometry
 */
function MajorMinorRule(userOptions) {
  /**
    * @typedef MajorMinorRule.Options
    * @description
    * These are the options specific to this class. Other options provided by {@link Geometry.Options} can also be
    * passed to create a PlotBody.
    *
    * @property {Integer[]} majorDivs     A two element array of integers describing the number of major divisions in
    *                                     the PlotBody grid [horizontal, vertical].
    * @property {Integer[]} minorDivs     A two element array of integers describing the number of minor divisions
    *                                     between major divisions in the PlotBody grid [horizontal, vertical].
    * @property {Float[]} majorFraction   A two element array of floats describing the fraction of the geometry which
    *                                     major grid lines should span. [horizontal, vertical]
    * @property {Float[]} minorFraction   A two element array of floats describing the fraction of the geometry which
    *                                     major grid lines should span.
    * @property {Float[]} majorGridColor  A four element array ([r,g,b,a]) of floating point values, 0 to 1 describing
    *                                     the color of major grid lines
    * @property {Float[]} minorGridColor  A four element array ([r,g,b,a]) of floating point values, 0 to 1 describing
    *                                     the color of minor grid lines
    */
  let options = mergeOptions({
    majorDivs: [4, 4],
    minorDivs: [4, 4],
    majorFraction: [1.0, 1.0],    /* Fraction of the drawable to render major lines */
    minorFraction: [1.0, 1.0],    /* Fraction of the drawable to render minor lines */
    majorGridColor: cfg.MAJOR_GRID_COLOR,
    minorGridColor: cfg.MINOR_GRID_COLOR,
  }, userOptions);

  Geometry.call(this, options);

  this.opts = options;
  this.shader = new BaseShader();
  this.numMajorLines = 0;
  this.numSubLines = 0;
  this._createGrid();
}

MajorMinorRule.prototype = Object.assign( Object.create(Geometry.prototype), {

  initGl : function(gl) {
    Geometry.prototype.initGl.call(this, gl);
    this.shader.initGl(gl);
  },

  draw : function(gl) {
    Geometry.prototype.draw.call(this, gl);
    this.setShaderPosition(gl, this.shader);
    this.shader.color(gl, this.opts.majorGridColor);
    gl.lineWidth(cfg.MAJOR_GRID_LINE_WIDTH);
    gl.drawArrays(gl.LINES, 0, this.numMajorLines);
    gl.lineWidth(cfg.MINOR_GRID_LINE_WIDTH);
    if (this.numSubLines) {
      this.shader.color(gl, this.opts.minorGridColor);
      gl.drawArrays(gl.LINES, this.numMajorLines, this.numSubLines);
    }
  },

  _createGrid : function() {

    this.numMajorLines = 0;
    this.numSubLines = 0;

    let subDivVerts = [];

    for (let axisI = 0; axisI < this.opts.majorDivs.length; axisI++) {
      let axisCount = this.opts.majorDivs[axisI];
      let width = axisCount ? 1 / axisCount : 0;

      for (let lineI = 0; lineI < axisCount + 1;  lineI++) {
        let pos = width * lineI;
        let verts = new Array(6).fill(0);

        /* Set X coords for columns, Ys for rows */
        verts[axisI] = pos;
        verts[axisI + cfg.COORDS_PER_VERT] = pos;

        /* Set opposite vert in Y for columns, X for rows */
        verts[Math.abs(axisI-1)] = this.opts.majorFraction[axisI];
        this.addVertices(verts);
        this.numMajorLines += 2;

        /* Generate sub division vertices but don't add them to the main buffer yet */
        for (let subI = 0; subI < this.opts.minorDivs[axisI]; subI ++) {
          let subWidth = width / this.opts.minorDivs[axisI];
          let subPos = pos + subWidth * subI;
          let verts = new Array(6).fill(0);
          verts[axisI] = subPos;
          verts[axisI + cfg.COORDS_PER_VERT] = subPos;
          verts[Math.abs(axisI-1)] = this.opts.minorFraction[axisI];
          Array.prototype.push.apply(subDivVerts, verts);
          this.numSubLines += 2;
        }
      }
    }

    this.addVertices(subDivVerts);
  },

});