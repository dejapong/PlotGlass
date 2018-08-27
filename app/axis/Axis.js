import {mergeOptions, newDiv} from "Util";
import Element from "Element";
import {AxisDefs, testAxisLocation, AxisLocation} from "axis/AxisDefs";
import AxisTitle from "axis/AxisTitle";
import AxisLabels from "axis/AxisLabels";
import AxisScale from "axis/AxisScale";

export default Axis;

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
  location: AxisLocation.X_AXIS_BOTTOM,
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
};

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

  Element.call(this);

  /*
   * Pass the same options to subelements, except let them set their own class and style.
   */
  let subOptions = JSON.parse(JSON.stringify(userOptions));

  delete subOptions.class;
  delete subOptions.style;

  this._scaleSubelement = new AxisScale(subOptions);
  this._labelsSubelement = new AxisLabels(subOptions);
  this._titleSubelement = new AxisTitle(subOptions);

  this.add([
    this._scaleSubelement,
    this._labelsSubelement,
    this._titleSubelement
  ]);

  this.handleOption("location",      this._setLocation);
  this.handleOption("range",         this._labelsSubelement);
  this.handleOption("flipDirection", this._labelsSubelement);
  this.handleOption("numLabels",     this._labelsSubelement);
  this.handleOption("title",         this._titleSubelement);
  this.handleOption("numMinorTicks", this._scaleSubelement);
  this.handleOption("numMajorTicks", this._scaleSubelement);

  this.update(defaultOptions);

  if (typeof userOptions !== "undefined") {
    this.deserialize(userOptions);
  }

};

Axis.prototype = Object.assign( Object.create(Element.prototype), {

  _setLocation(location) {

    testAxisLocation(location);

    /* Update element style */
    let style = {};
    switch(location) {
      case AxisLocation.X_AXIS_BOTTOM: /* fallthrough */
      case AxisLocation.X_AXIS_TOP:
        style.flexDirection = "column";
        break;
      case AxisLocation.Y_AXIS_LEFT: /* fallthrough */
      case AxisLocation.Y_AXIS_RIGHT:
        style.flexDirection = "row";
        break;
    };

    Object.assign(this.element.style, style);

    /* Append subelements in order, depending on axis location */
    let elements = [];

    switch(location) {
      case AxisLocation.X_AXIS_BOTTOM: /* fallthrough */
      case AxisLocation.Y_AXIS_RIGHT:
        elements.push(this._scaleSubelement.element, this._labelsSubelement.element, this._titleSubelement.element);
        break;
      case AxisLocation.Y_AXIS_LEFT: /* fallthrough */
      case AxisLocation.X_AXIS_TOP:
        elements.push(this._titleSubelement.element, this._labelsSubelement.element, this._scaleSubelement.element);
        break;
    }

    for (let element of elements) {
      this.element.appendChild(element);
    }

  },

});