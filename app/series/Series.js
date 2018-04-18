import Geometry from "Geometry";
import BaseShader from "shader/BaseShader";
import {mergeOptions} from "Util";
import cfg from "Config"

export default Series;

/**
 * @constructor
 * @description Base class for Data series
 */
function Series(userOptions) {

  /**
    * @typedef Series.Options
    * @description Extends {@link Geometry.Options}
    */
  let options = mergeOptions({

    /* Overriden options */
    origin : [0,-1],
    size : [2,2],
    coordBufferLength : 100000*30,
  }, userOptions);

  Geometry.call(this, options);

  this.shader = new BaseShader();
  this._size = options.size;
  this._origin = options.origin;
  this._color = options.color;
}

Series.prototype = Object.assign( Object.create(Geometry.prototype), {

  /**
   * @memberof Series
   * @instance
   * @description
   * Update the series data
   * @param {Object} frame data value object
   **/
  updateData: function(frame){
    /* pass */
  },

  /**
   * @memberof Series
   * @instance
   * @description
   * Update the data series with new axis options
   * @param {Axis.Options[]} axes   Two element array of {@link Axis.Options} for this series:
   *                                [dependent axis, independent axis].
   */
  setAxes : function(axes) {

    let ranges = [
      [axes[0].range[0], axes[0].range[1] ],
      [axes[1].range[0], axes[1].range[1] ],
    ];

    for (let i =0; i < ranges.length; i++) {
      if (axes[i].flipDirection) {
        ranges[i].reverse();
      }
    }

    this._origin[0] = ranges[0][0];
    this._origin[1] = ranges[1][0];
    this._size[0] = ranges[0][0] - ranges[0][1];
    this._size[1] = ranges[1][1] - ranges[1][0];
  },

});