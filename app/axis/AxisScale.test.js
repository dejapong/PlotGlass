import AxisScale from "axis/AxisScale";
import { AxisLocation } from "axis/AxisDefs";
import assert from "assert";
import jsdom from "jsdom-global";

jsdom();

/**
 * @todo AxisScale, and other visual components probably can't be convered fully by unit tests, unless the tests become needlessly fragile (checking vertex coordinates, reading pixels, etc). I need to figure out a better system for visual components, possibly a gallery of rendered results for human checking.
 */
describe("AxisScale", function() {
  for (let location in AxisLocation) {
    it(`Creates labels for location: ${
      AxisLocation[location]
    } (${location})`, function() {
      let at = new AxisScale({
        axis: AxisLocation[location]
      });
      assert(at.element instanceof HTMLElement);
    });
  }

  it(`Rejects invalid axis locations`, function() {
    assert.throws(function() {
      new AxisScale({
        axis: "invalidLocation"
      });
    }, Error);
  });
});
