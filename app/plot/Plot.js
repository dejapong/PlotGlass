import { appendNewDiv, mergeOptions } from "Util";
import Axis from "axis/Axis";
import AxisDefs from "axis/AxisDefs";
import Element from "Element";
import cfg from "Config";

import PlotView from "plot/PlotView";
import PlotDataHandler from "plot/PlotDataHandler";
import PlotAxesHandler from "plot/PlotAxesHandler";

export default Plot;

/**
 * @constructor
 * @extends Element
 * @description
 * Generic base class for a plot which contains axes, data sources and series.
 *
 *  * ***axes***: Plots can have 2 or more axes. These can either be horizontal or vertical axes, and a multiple axes may
 *    exist for either direction. Axes for a plot are named. Their names are used in data series' options to
 *    identify which axes the series uses. Even though at least 2 axes definitions are required for scaling
 *    series, the axes may be `hidden (set visible option to false).
 *
 *  * ***sources***:  Plots can have multiple data sources, of different types. These sources are named, and their names used
 *    in data series' options to which source the series uses.
 *
 *  * ***series***: Plots can have multiple data series. These extract values from their data source, and plot the values
 *    along their dependent and independent axes.
 *
 * @todo format description
 * @todo Right now it's weird that some setters receive options, but return instances. I think I should separate
 *       options out as the instance's serialization, and then let users set/get instances as expected, but then
 *       separately serialize/deserialize instances based on passed options. Initial construction would still take
 *       an optional options object as the initial serialization.
 */

function Plot(userOptions) {
  let _ = this;

  /**
   * @typedef Plot.Options
   * @description
   * These are the options specific to this class. Other options provided by {@link Element.Options} can also be passed
   * to create a Plot.
   *
   * @property {Object} axes            An object of {@link Axis.Options} objects. Object keys are axis names which can be
   *                                    used for modifying the plot after construction.
   * @property {Object} sources         An object of {@link WebSocketJson.Options} objects. Object keys are source names which can
   *                                    be used for modifying data sources after construction.
   * @property {Object} series          An object of {@link Series.Options} objects. Object keys are series names which can
   *                                    be used for modifying data series after construction.
   * @property {PlotBody.Options} body  Options for the plot's body
   *
   **/
  let options = mergeOptions(
    {
      title: "Untitled Plot",
      axes: {},
      sources: {},
      series: {},
      body: {},

      class: "pgPlot",
      container: null,
      style: {
        width: "300px",
        height: "300px",
        display: "flex",
        flexDirection: "column"
      }
    },
    userOptions
  );

  Element.call(this, options);

  /**
   * @todo
   * it's not cool that the data handler accesses the view's private members (_plotBody and _axisContainers).
   * PlotBody should probably be pulled out into its own subelement, on the same level as view, and data and axes
   * handlers. Unfortunately, there will be some view sizing issues to work out.
   * I'm not sure how I'd refactor axisContainers right now, but there should be some consistency with plotBody
   */
  let view = new PlotView(mergeOptions({ element: this.element }, options));
  let dataHandler = new PlotDataHandler(
    options.series,
    options.sources,
    view._plotBody
  );
  let axesHandler = new PlotAxesHandler(options.axes, view._axisContainers);

  /* Update the data handler when the axes change, so that the data handler can resize the series that depend on axes
     which have been modified */
  axesHandler.onChange = function(axes) {
    dataHandler.handleAxesChange(axes);
  };

  this.add([view, axesHandler]);

  /**
   * @member title
   * @memberof Plot
   * @instance
   * @type String
   * @description Plot title
   **/
  Object.defineProperty(this, "title", {
    set: view.setTitle.bind(view),
    get: view.getTitle.bind(view)
  });

  /**
   * @member axes
   * @memberof Plot
   * @instance
   * @type {Axis.Options}
   * @description
   *
   * Set this value using an object of {@link Axis.Options} objects. Note that changing axes names may break some data
   * series, which would then need to be updated as well.
   *
   * Reading this value returns an object of Axis instances, instead of their options
   **/
  Object.defineProperty(this, "axes", {
    set: axesHandler.setAxes.bind(axesHandler),
    get: axesHandler.getAxes.bind(axesHandler)
  });

  /**
   * @member series
   * @memberof Plot
   * @instance
   * @type {Series.Options}
   * @description
   *
   * Set this value using an object of {@link Series.Options} objects.
   *
   * Reading this value returns an object of Series instances, instead of their options
   **/
  Object.defineProperty(this, "series", {
    set: dataHandler.setSeries.bind(dataHandler),
    get: dataHandler.getSeries.bind(dataHandler)
  });

  /**
   * @member sources
   * @memberof Plot
   * @instance
   * @type {WebSocketJson.Options}
   * @description
   * Set this value using an object of {@link WebSocketJson.Options} objects. Note that changing source names may break some
   * data series, which would then need to be updated as well.
   *
   * Reading this value returns an object of Source instances, instead of their options
   **/
  Object.defineProperty(this, "sources", {
    set: dataHandler.setSources.bind(dataHandler),
    get: dataHandler.getSources.bind(dataHandler)
  });

  /* Set initial values */
  this.sources = options.sources;
  this.series = options.series;
  this.axes = options.axes;
}

Plot.prototype = Object.assign(Object.create(Element.prototype), {});
