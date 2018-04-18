import {mergeOptions} from "Util";
import {AxisDefs, testAxisLocation, AxisLocation} from "axis/AxisDefs";
import DrawRegion from "DrawRegion";
import MajorMinorRule from "MajorMinorRule";
import cfg from "Config";
export default AxisScale;

/**
  * @constructor
  * @extends module:Element
  * @description
  * DrawRegion drawing scale for axis. Intended to be used as a subelement for Axis, or anywhere that a horizontal or
  * vertical scale, with major and minor ticks are needed.
  * @param {AxisScale.Options} userOptions User provided options for the axis which extends {@link module:Element~Options}
  */
function AxisScale(userOptions) {

  /**
    * @typedef AxisScale.Options
    *
    * @description
    * These are the options specific to this class. Other options provided by {@link Element.Options} can also be passed
    * to create an Axis.
    *
    * @property {AxisLocation} axis       Axis location. Scale will be drawn as follows:
    *                                       X_AXIS_TOP : Spine on the bottom, ticks bottom to top
    *                                       Y_AXIS_LEFT : Spine on the right, ticks right to left
    *                                       X_AXIS_BOTTOM : Spine on the top, ticks top to bottom
    *                                       Y_AXIS_RIGHT : Spin on the left, ticks left to right
    *                                     @todo, fix description alignment
    * @property {Number[]} range          Min and max values of axis scale [min, max]
    * @property {Boolean} flipDirection   If true, the axis direction will be flipped with respect to the default
    *                                     direction
    * @property {Number} numMajorTicks    Number of major ticks, and also labels that will be displayed on the axis
    * @property {Number} numMinorTicks    Number of minor ticks (ticks between major ticks)
    **/
  let options = mergeOptions({
    axis: AxisLocation.X_AXIS_BOTTOM,
    range:[-1, 1],
    flipDirection: false,
    numMajorTicks: 5,
    numMinorTicks: 4,

    /* Overriden options */
    class: "pgAxisScale",
    style: {
      flexGrow: 1,
      minWidth: "10px",
      minHeight: "10px"
    }
  }, userOptions);

  DrawRegion.call(this, options);

  /* Use a major minor rule to create the axis scale */
  let gridOpts = {
    majorGridColor:[0,0,0,1],
    minorGridColor:[0,0,0,1],
  }

  let xGridOpts = Object.assign({
    minorFraction:[0.5, 1],
    majorFraction:[1.0, 1],
  }, gridOpts);

  let yGridOpts = Object.assign({
    minorFraction:[1, 0.5],
    majorFraction:[1, 1.0],
  }, gridOpts);

  let grid;

  testAxisLocation(options.axis);
  if (options.axis == AxisLocation.X_AXIS_BOTTOM) {
    grid = new MajorMinorRule(Object.assign({
      majorDivs:[options.numMajorTicks - 1, 0],
      minorDivs:[options.numMinorTicks + 1, 0],
      origin: [0, 1],
      size: [1, -1],
    }, xGridOpts));
  } else if (options.axis == AxisLocation.Y_AXIS_LEFT) {
    grid = new MajorMinorRule(Object.assign({
      majorDivs:[0, options.numMajorTicks - 1],
      minorDivs:[0, options.numMinorTicks + 1],
      origin: [1, 0],
      size: [-1, 1],
    }, yGridOpts));
  } else if (options.axis == AxisLocation.X_AXIS_TOP) {
    grid = new MajorMinorRule(Object.assign({
      majorDivs:[options.numMajorTicks - 1, 0],
      minorDivs:[options.numMinorTicks + 1, 0],
      origin: [0, 0],
      size: [1, 1],
    }, xGridOpts));
  } else if (options.axis == AxisLocation.Y_AXIS_RIGHT) {
    grid = new MajorMinorRule(Object.assign({
      majorDivs:[0, options.numMajorTicks - 1],
      minorDivs:[0, options.numMinorTicks + 1],
      origin: [0, 0],
      size: [1, 1],
    }, yGridOpts));
  }

  this.add(grid);
}

AxisScale.prototype = Object.assign( Object.create( DrawRegion.prototype ), {});