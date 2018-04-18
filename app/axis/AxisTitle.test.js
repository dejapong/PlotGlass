import AxisTitle from "axis/AxisTitle"
import {AxisLocation} from "axis/AxisDefs"
import assert from "assert"
import jsdom from 'jsdom-global'
import {testTitle1, testTitle2} from "axis/AxisData.test";

jsdom();

describe("AxisTitle", function() {

  for (let location in AxisLocation) {

    it(`Creates axis at location: ${AxisLocation[location]} (${location})`, function() {
      let at = new AxisTitle({
        axis : AxisLocation[location]
      });
      assert( at.element instanceof HTMLElement );
    });

    it(`Creates title text at location: ${AxisLocation[location]} (${location})`, function() {
      let at = new AxisTitle({
        axis : AxisLocation[location],
        title : testTitle1,
      });
      assert.equal(testTitle1, at.element.textContent)
    });

    it(`Updates title text: ${AxisLocation[location]} (${location})`, function() {
      let at = new AxisTitle({
        axis : AxisLocation[location],
        title :testTitle1,
      });
      assert.equal(testTitle1, at.element.textContent)
      at.title = testTitle2;
      assert.equal(testTitle2, at.element.textContent)
    });

  }

  it(`Rejects invalid axis locations`, function() {
    assert.throws(function(){
      new AxisTitle({
        axis : "invalidLocation"
      })
    }, Error);
  });

});