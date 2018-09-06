import { mergeOptions } from "Util";
import DrawRegion from "DrawRegion";
import MajorMinorRule from "MajorMinorRule";

export default PlotBody;

/**
 * @constructor
 * @description Plot body (Center portion surrounded by axis) with grid
 * @extends DrawRegion
 */
function PlotBody(userOptions) {
  /**
   * @typedef PlotBody.Options
   * @description
   * Options provided by {@link DrawRegion.Options} and {@link MajorMinorRule} are used to create a plotBody
   */
  let options = mergeOptions(
    {
      class: "pgPlotBody"
    },
    userOptions
  );

  DrawRegion.call(this, options);

  let grid = new MajorMinorRule(options);
  this.add(grid);
}

PlotBody.prototype = Object.assign(Object.create(DrawRegion.prototype), {});
