import {appendNewDiv, mergeOptions} from "Util";
import {AxisDefs, testAxisLocation, AxisLocation} from "axis/AxisDefs";
import Element from "Element";
export default AxisLabels;

/**
  * @constructor
  * @extends module:Element
  * @description
  * HTML element containing evenly spaced labels intended to be used as a subelement for {@link Axis}.
  * @todo We need some way to control precision, or at least provide an automatic human-readable value for label text
  * @param {AxisLabels.Options} userOptions User provided options for the axis which extends {@link module:Element~Options}
  */
function AxisLabels (userOptions) {

  /**
    * @typedef AxisLabels.Options
    *
    * @description
    * These are the options specific to this class. Other options provided by {@link Element.Options} can also be passed
    * to create an Axis.
    *
    * @property {AxisLocation} axis       Axis location
    * @property {Number[]} range          Min and max values of axis scale [min, max]
    * @property {Boolean} flipDirection   If true, the axis direction will be flipped with respect to the default
    *                                     direction
    * @property {Number} numLabels        Number of labels that will be displayed on the axis
    **/
  let options = mergeOptions({
    axis: AxisLocation.X_AXIS_BOTTOM,
    range: [-1, 1],
    flipDirection: false,
    numLabels: 5,

    /* Default options for base classes */
    class: "pgAxisLabels",
    style: {
      display: "flex",
      justifyContent: "space-between",
    }
  }, userOptions);

  /* @todo need to figure out this deserialization stuff in a consistent way. Right now, calling
  deserialize won't give the same result as creating an AxisLabels instance, due to parent deserializations
  not getting called */
  Element.call(this, options);

  this.handleOption("location", function(value) {
    this.updateLabels();
  }.bind(this));

  this.handleOption("range", function(value) {
    this.updateLabels();
  }.bind(this));

  this.handleOption("flipDirection", function(value){
    this.updateLabels();
  }.bind(this));

  this.handleOption("numLabels", function(value){
    this.updateLabels();
  }.bind(this));

  this.deserialize(options);
}

AxisLabels.prototype = Object.assign( Object.create(Element.prototype), {

  /**
   * @memberof AxisLabels
   * @member
   * @description
   * Clear any existing, then append an equal number of labels, spaced evenly, to this element.
   *
   * @param {AxisLabels.Options} options User provided options for the axis
   */
  updateLabels() {

    let _ = this;

    /* Labels are added left to right, and top to bottom. */
    testAxisLocation(this.location);
    switch(this.location) {
      case AxisLocation.X_AXIS_BOTTOM: /* fallthrough */
      case AxisLocation.X_AXIS_TOP:
        Object.assign(this.style, {
          flexDirection : "row",
          margin:"0px -1em 0px -1em"
        });
        /* X-axis, standard label direction is increasing to the right */
        this._largestFirst = this.flipDirection || false;
        break;
      case AxisLocation.Y_AXIS_LEFT: /* fallthrough */
      case AxisLocation.Y_AXIS_RIGHT:
        Object.assign(this.style, {
          flexDirection : "column",
          margin:"-0.5em 0px -0.5em 0px"
        });
        /* Y-axis, standard label direction is decreasing down */
        this._largestFirst = !(this.flipDirection || false);
        break;
    };
    Object.assign(this.element.style, this.style);

    this.element.innerHTML = "";
    console.assert(this.range.length == 2, "Range must be a [min, max] pair array.");
    let min = this.range[0];
    let max = this.range[1];
    let bounds = this.element.getBoundingClientRect();
    let axisSep = bounds.width/(this.numLabels-1);
    Object.assign(this.element.style, {"justify-content": "space-between"});

    for (let i =0; i < this.numLabels; i++) {
      let label = appendNewDiv(this.element, { style: {}});
      let magnitude = max - min;
      let text = this._largestFirst
        ? (max - magnitude * i/(this.numLabels-1)).toFixed(2)
        : (min + magnitude * i/(this.numLabels-1)).toFixed(2);
      label.innerHTML = text;
    }

  },
});