import AxisLabels from "axis/AxisLabels"
import {AxisLocation} from "axis/AxisDefs"
import assert from "assert"
import jsdom from 'jsdom-global'
import {testLabelData10, testLabelData10r} from "axis/AxisData.test";

jsdom();

describe("AxisLabels", function() {

  for (let location in AxisLocation) {
    it(`Creates labels for location: ${AxisLocation[location]} (${location})`, function() {
      let at = new AxisLabels({
        axis : AxisLocation[location]
      });
      assert( at.element instanceof HTMLElement );
    });
  }

  it(`Creates the correct number of labels`, function() {
    assert.equal(new AxisLabels({
      numLabels : 3
    }).element.children.length, 3);
    assert.equal(new AxisLabels({
      numLabels : 10
    }).element.children.length, 10);
    assert.equal(new AxisLabels({
      numLabels : 0
    }).element.children.length, 0);
    assert.equal(new AxisLabels({
      numLabels : -10
    }).element.children.length, 0);
  });

  it(`Creates the correct range of values`, function() {
    let at = new AxisLabels({
      range: testLabelData10.range,
      numLabels: testLabelData10.numLabels
    });

    for (let i =0; i < testLabelData10.labels.length; i++) {
      assert.equal(testLabelData10.labels[i], at.element.children[i].textContent);
    }
  });

  it(`Flips the direction of values`, function() {
    let at = new AxisLabels({
      range: testLabelData10r.range,
      numLabels: testLabelData10r.numLabels,
      flipDirection : testLabelData10r.flipDirection
    });

    for (let i =0; i < testLabelData10r.labels.length; i++) {
      assert.equal(testLabelData10r.labels[i], at.element.children[i].textContent);
    }
  });

  it(`Rejects invalid axis locations`, function() {
    assert.throws(function(){
      new AxisLabels({
        axis : "invalidLocation"
      })
    }, Error);
  });

});