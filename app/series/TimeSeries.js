import Series from "series/Series";
import Geometry from "Geometry";
import cfg from "Config";
import Stats from "Stats";

export default TimeSeries;

/**
 * @constructor
 * @description Time strip series
 */
function TimeSeries(options = {}) {
  /**
   * @typedef TimeSeries.Options
   * @description Extends {@link Series.Options}
   * @property {Object} vertical True if time series should be plotted vertically
   * @property {Object} source Data source parameters
   * @property {String} source.name Name of data source
   * @property {String} source.value Name of field in data frame to plot as value
   * @property {String} source.time Name of field in data frame to plot as time, or "$(time)" to use client time.
   */
  Series.call(this, options);

  this.numVertices = 0;
  this._shadersInitialized = false;
  this._firstTimeValue = null;

  this._sourceName = options.source.name;
  this._sourceField = options.source.value;
  this._timeField = options.source.time ? options.source.time : "$(time)";
  this._vertical = options.vertical;
}

TimeSeries.prototype = Object.assign(Object.create(Series.prototype), {
  /**
   * @memberof TimeSeries
   * @instance
   * @description
   * Update the times series with a frame of data. See: {@link Series.updateData}
   */
  updateData(frame) {
    let time = frame[this._timeField];

    if (this._firstTimeValue === null) {
      this._firstTimeValue = time;
    }

    let x = time - this._firstTimeValue;
    let y = frame[this._sourceName][this._sourceField];
    let t = 0;

    let dep, inp, idx;

    if (this._vertical) {
      dep = x;
      inp = y;
      idx = 1;
    } else {
      dep = y;
      inp = x;
      idx = 0;
    }

    if (this._size[idx] < 0) {
      this._origin[idx] = x;
    } else {
      this._origin[idx] = x - this._size[idx];
    }

    this.addVertices([inp, dep, t]);
  },

  initGl: function(gl) {
    Geometry.prototype.initGl.call(this, gl);

    if (!this._shadersInitialized) {
      this.shader.initGl(gl);
      this._shadersInitialized = true;
    }
  },

  draw: function(gl) {
    Geometry.prototype.draw.call(this, gl);

    if (this.numVertices) {
      this.setCamera(this._origin, this._size);
      this.setShaderPosition(gl, this.shader);
      this.shader.color(gl, this._color);
      this.drawCircular(gl);
    }
  },

  setAxes: function(axes) {
    Series.prototype.setAxes.call(this, axes);

    if (this._vertical) {
      this._size[0] = -this._size[0];
      this._size[1] = -this._size[1];
    }
  }
});
