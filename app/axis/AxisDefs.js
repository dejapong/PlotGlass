/**
 * @module AxisDefs
 * @description This module contains global axis members
 */
export { AxisDefs, AxisLocation };

/**
 * @enum
 */
var AxisDefs = {
  X_AXIS_INDEX: 0,
  Y_AXIS_INDEX: 1
};

/**
 * @enum {String}
 * @readonly
 */
var AxisLocation = {
  /**
   * @member {String}
   * @description X axis above the plot body
   **/
  X_AXIS_TOP: "xTop",
  /**
   * @member {String}
   * @description Y axis to the left of the plot body
   **/
  Y_AXIS_LEFT: "yLeft",
  /**
   * @member {String}
   * @description X axis below the plot body
   **/
  X_AXIS_BOTTOM: "xBottom",
  /**
   * @member {String}
   * @description Y axis to the right of the plot body
   **/
  Y_AXIS_RIGHT: "yRight"
};

/**
 * Test the validity of any axis location string
 * @throws Error if the string does not match any value in {@link AxisLocation}
 * @param  {String} location Location to test
 * @return void
 */
export function testAxisLocation(location) {
  const values = Object.values(AxisLocation);
  if (values.indexOf(location) === -1) {
    throw Error(
      `Unrecognized axis location ${location}. Choose from ${values.join(", ")}`
    );
  }
}
