import {mergeOptions, newDiv} from "Util";
import Element from "Element";
import {AxisDefs, testAxisLocation, AxisLocation} from "axis/AxisDefs";
import AxisTitle from "axis/AxisTitle";
import AxisLabels from "axis/AxisLabels";
import AxisScale from "axis/AxisScale";
export default Axis;

/**
  * @constructor
  * @extends Element
  * @description
  * HTML element for drawing an axis with rules and labels. An axis can reside in any of the four border
  * locations around a plot body. (see {@link AxisLocation})
  *
  * @param {Axis.Options} userOptions Options for the axis which extends {@link Element.Options}
  */
function Axis(userOptions) {

  let _ = this;

  /**
    * @typedef Axis.Options
    *
    * @description
    * These are the options specific to this class. Other options provided by {@link Element.Options} can also be passed
    * to create an Axis.
    *
    * @property {AxisLocation} axis       Axis location
    * @property {Number[]} range          Min and max values of axis scale [min, max]
    * @property {Boolean} flipDirection   If true, the axis direction will be flipped with respect to the default
    *                                     direction
    * @property {Number} numLabels        Number of axis labels.
    * @property {Number} numMajorTicks    Number of major ticks
    * @property {Number} numMinorTicks    Number of minor ticks (ticks between major ticks)
    **/
  const defaultOptions = {
    axis: AxisLocation.X_AXIS_BOTTOM,
    range:[-1, 1],
    flipDirection: false,
    numLabels: 5,
    numMajorTicks: 5,
    numMinorTicks: 3,

    /* Default options for base classes */
    visible:true,
    class:"pgAxis",
    style: {
      display:"flex",
    },
  }

  let options = mergeOptions(defaultOptions, userOptions);

  /* Flex direction depends on axis location. Modify this before calling parent constructor */
  testAxisLocation(options.axis);
  switch(options.axis) {
    case AxisLocation.X_AXIS_BOTTOM: /* fallthrough */
    case AxisLocation.X_AXIS_TOP:
      options.style.flexDirection = "column";
      break;
    case AxisLocation.Y_AXIS_LEFT: /* fallthrough */
    case AxisLocation.Y_AXIS_RIGHT:
      options.style.flexDirection = "row";
      break;
  }

  Element.call(this, options);

  /* Pass the same options to subelements, except let them set their own class and style.
   */
  let subOptions = JSON.parse(JSON.stringify(options));
  delete subOptions.class;
  delete subOptions.style;

  let axisScale = new AxisScale(subOptions);
  let axisLabels = new AxisLabels(subOptions);
  let axisTitle = new AxisTitle(subOptions);
  this.add([axisScale, axisLabels, axisTitle]);

  /* Append subelements in order, depending on axis location */
  let elements = [];
  switch(options.axis) {
    case AxisLocation.X_AXIS_BOTTOM: /* fallthrough */
    case AxisLocation.Y_AXIS_RIGHT:
      elements.push(axisScale.element, axisLabels.element, axisTitle.element);
      break;
    case AxisLocation.Y_AXIS_LEFT: /* fallthrough */
    case AxisLocation.X_AXIS_TOP:
      elements.push(axisTitle.element, axisLabels.element, axisScale.element);
      break;
  }

  for (let element of elements) {
    this.element.appendChild(element);
  }

  /**
   * @instance
   * @member title Axis title, drawn vertically or horizontally.
   * @memberof Axis
   **/
  Object.defineProperty(this, "title", {
    set: function(value){
      axisTitle.title = value;
    },
    get: function() {
      return axisTitle.title;
    }
  });

  /**
   * @member range Axis range
   * @memberof Axis
   * @instance
   * @type Number[]
   * @description A two element array containing the axis min and max values [min, max] as floating point numbers.
   **/
  Object.defineProperty(this, "range", {
    set: function(value) {
      options.range = value.slice();
      axisLabels.deserialize(options);
      _.onAxisChange();
    },
    get: function() {
      return options.range.slice();
    }
  });

  /**
   * @member flipDirection
   * @memberof Axis
   * @instance
   * @type Boolean
   * @description If set to true, axis scale will be flipped with respect to the default.
   *              The default axis direction increases left to right, and bottom to top.
   **/
  Object.defineProperty(this, "flipDirection", {
    set: function(value) {
      options.flipDirection = value;
      axisLabels.deserialize(options);
      _.onAxisChange();

    },
    get: function() {
      return options.flipDirection;
    }
  });

  /* Set default handlers */
  this.onAxisChange = function(){};
};

Axis.prototype = Object.assign( Object.create(Element.prototype), {});