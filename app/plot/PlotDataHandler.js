import TimeSeries from "series/TimeSeries";
import WebSocketJson from "source/WebSocketJson";
export default PlotDataHandler;

/**
 * @constructor
 * @description Handler for plot data sources and series
 * @param {Object} Object of {@link Sources.Options} indexed by source names
 * @param {Object} Object of {@link Sources.Options} indexed by series names
 * @param {PlotBody} plotBody PlotBody instance for this plot
 */
function PlotDataHandler(sourcesOptions, seriesOptions, plotBody) {
  this._plotBody = plotBody;
  this._sourcesOptions = sourcesOptions;
  this._seriesOptions = seriesOptions;
  this._seriesInstances = {};
  this._sourceInstances = {};
  this._dataValues = {};
  this._seriesBySourceName = {};
}

PlotDataHandler.prototype = {
  /**
   * Stores last frame from each data source, and updates each series.
   * @param name   Data source name
   * @param frame  Last frame received from the data source
   */
  _collateData: function(name, frame) {
    this._dataValues["$(time)"] = new Date().getTime() / 1000;

    this._dataValues[name] = frame;
    let series = this._seriesBySourceName[name];

    for (let i = 0; i < series.length; i++) {
      series[i].updateData(this._dataValues);
    }
  },

  /**
   *  The PlotDataHandler ensures that all series get updated when axis limits change
   *
   *  @todo, I need to think of a better way to synchronize axes name changes with series updates
   *  @param {Object} axes An object of {Axis.Options} indexed by axis names
   */
  handleAxesChange: function(axes) {
    for (let seriesName in this._seriesInstances) {
      this._seriesInstances[seriesName].setAxes([
        axes[this._seriesOptions[seriesName].axes[0]],
        axes[this._seriesOptions[seriesName].axes[1]]
      ]);
    }
  },

  /**
   * @return Object of {@link Source} instances indexed by source name
   */
  getSources: function() {
    return this._sourceInstances;
  },

  /**
   * @description
   * Set the data sources by options
   *
   * @param  {Object} sources Object of {@link WebSocketJson.Options}, indexed by source name
   */
  setSources: function(sources) {
    this._sourcesOptions = sources;

    for (let sourceName in sources) {
      let sourceOptions = sources[sourceName];

      if (sourceOptions.type === "WebSocketJson") {
        let ws = new WebSocketJson(sourceOptions);
        this._sourceInstances[sourceName] = ws;
        ws.addHandler(this._collateData.bind(this, sourceName));
      } else {
        console.error(`Data type is unsupported: ${seriesOpts.type}`);
      }
    }
  },

  /**
   * @return Object of series instances indexed by series name
   */
  getSeries: function() {
    return this._seriesInstances;
  },

  /**
   * @description
   * Set the data series by and object of options
   *
   * @param  {Object} series Object of {@link Series.Options}, indexed by series name
   */
  setSeries: function(seriesOptions) {
    for (let seriesName in this._seriesOptions) {
      this._plotBody.remove(this._seriesInstances[seriesName]);
      delete this._seriesInstances[seriesName];
    }

    this._seriesOptions = seriesOptions;

    for (let seriesName in this._seriesOptions) {
      let seriesOpts = this._seriesOptions[seriesName];
      let ts;

      if (seriesOpts.type === "time") {
        ts = new TimeSeries(seriesOpts);
      } else {
        console.error(`Series type is unknown: ${seriesOpts.type}`);
      }

      let sourceName = seriesOpts.source.name;

      if (!(seriesOpts.source.value in this._seriesBySourceName)) {
        this._seriesBySourceName[sourceName] = [];
      }

      this._seriesInstances[seriesName] = ts;
      this._seriesBySourceName[sourceName].push(ts);
      this._plotBody.add(ts);
    }
  }
};
