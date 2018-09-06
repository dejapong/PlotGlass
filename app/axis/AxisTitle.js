import { appendNewDiv, mergeOptions } from "Util";
import { testAxisLocation, AxisLocation } from "axis/AxisDefs";
import Element from "Element";

export default AxisTitle;

/**
 * @constructor
 * @extends module:Element
 * @description
 * Axis Title intended as a subelement for axis, which displays a horizontal or vertical title
 * @param {AxisLabels.Options} userOptions User provided options for the axis which extends {@link module:Element~Options}
 */
function AxisTitle(userOptions) {
  /**
   * @typedef AxisTitle.Options
   *
   * @description
   * These are the options specific to this class. Other options provided by {@link Element.Options} can also be passed
   * to create an AxisTitle.
   *
   * @property {AxisLocation} axis     Axis location
   * @property {String} title          Axis title string
   **/
  let options = mergeOptions(
    {
      class: "pgAxisTitle",
      axis: AxisLocation.X_AXIS_BOTTOM,
      title: "Title",
      style: {
        width: "100%",
        display: "flex",
        whiteSpace: "nowrap",
        alignContent: "center",
        alignItems: "center"
      }
    },
    userOptions
  );

  let titleStyle = {};

  testAxisLocation(options.axis);
  switch (options.axis) {
    case AxisLocation.X_AXIS_BOTTOM: /* fallthrough */
    case AxisLocation.X_AXIS_TOP:
      options.style.flexDirection = "column";
      break;
    case AxisLocation.Y_AXIS_RIGHT:
      options.style.flexDirection = "row";
      titleStyle = {
        width: "1em",
        transform: "rotate(90deg)"
      };
      break;
    case AxisLocation.Y_AXIS_LEFT:
      options.style.flexDirection = "row";
      titleStyle = {
        width: "1em",
        transform: "rotate(-90deg)"
      };
      break;
    default:
      throw Error(
        `Unrecognized axis location ${
          options.axis
        }. Choose from ${Object.values(AxisLocation).join(", ")}`
      );
  }

  Element.call(this, options);

  this._axisTitleLabel = appendNewDiv(this.element, {
    class: "pgAxisTitleLabel",
    style: titleStyle
  });

  /**
   * @instance
   * @member title Axis title text
   * @memberof AxisTitle
   * @type String
   **/
  Object.defineProperty(this, "title", {
    set: function(value) {
      this._axisTitleLabel.innerHTML = value;
    }.bind(this),
    get: function() {
      return this._axisTitleLabel.innerHTML;
    }.bind(this)
  });

  this.title = options.title;
  this._axis = options.axis;
}

AxisTitle.prototype = Object.assign(Object.create(Element.prototype), {
  resize: function() {
    let bounds;
    switch (this._axis) {
      case AxisLocation.X_AXIS_BOTTOM: /* fallthrough */
      case AxisLocation.X_AXIS_TOP:
        break;
      case AxisLocation.Y_AXIS_RIGHT:
        bounds = this.element.getBoundingClientRect();
        Object.assign(this._axisTitleLabel.style, {
          transform: `rotate(90deg) translate(-${bounds.height / 3}px, 0px)`
        });
        break;
      case AxisLocation.Y_AXIS_LEFT:
        bounds = this.element.getBoundingClientRect();
        Object.assign(this._axisTitleLabel.style, {
          transform: `rotate(-90deg) translate(-${bounds.height / 3}px, 0px)`
        });
        break;
    }
  }
});
