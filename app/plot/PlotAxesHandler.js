import Drawable from "Drawable";
import Axis from "axis/Axis";
export default PlotAxesHandler;

/**
 * @constructor
 * @description Axes instance handler for a {@link Plot} instance.
 * @param {Plot.Options.axes} axesOptions axes portion of {@link Plot.Options}
 * @param {Object} axesContainers Object of parent HtmlElements for each axis element indexed by {@link AxisLocation}
 *                 string values
 */
function PlotAxesHandler(axesOptions, axesContainers) {
  Drawable.call(this);
  this._axesOptions = axesOptions;
  this._axisInstances = {};
  this._axesContainers = axesContainers;
  this.onChange = function(axes) {};
}

PlotAxesHandler.prototype = Object.assign({}, Drawable.prototype, {
  _handleAxisChange: function() {
    this.onChange(this.getAxes());
  },

  /**
   * @memberof PlotAxesHandler
   * @instance
   * @description
   * Set the axes by an option object. This will recreate the set of axes to match the options passed. Attempts to
   * modify one axis, requires options for all axes to be sent.
   * @param {Plot.Options.axes} axesOptions axes portion of {@link Plot.Options}
   */
  setAxes: function(axesOptions) {
    this._axesOptions = axesOptions;

    /* Remove old Axis instances */
    for (let axisName in this._axisInstances) {
      this.remove(this._axisInstances[axisName]);
    }

    this._axisInstances = {};

    /* Empty containers */
    for (let axisName in this._axesContainers) {
      let container = this._axesContainers[axisName];

      while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
      }
    }
    /* Create new axis instances */
    for (let axisName in this._axesOptions) {
      let axisOpts = this._axesOptions[axisName];
      let axis = new Axis(axisOpts);
      axis.onAxisChange = this._handleAxisChange.bind(this);
      this._axisInstances[axisName] = axis;
      this._axesContainers[axisOpts.axis].appendChild(axis.element);
      this.add(axis);
    }

    /* Update series data */
    for (let seriesName in this.series) {
      this.series[seriesName];
    }

    this.onChange(this.getAxes());
  },

  /**
   * @memberof PlotAxesHandler
   * @instance
   * @return
   * Object of axis instances, keyed by axis name
   */
  getAxes: function() {
    return this._axisInstances;
  }
});
