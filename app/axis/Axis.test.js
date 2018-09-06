import Axis from "axis/Axis";
import { AxisLocation } from "axis/AxisDefs";
import assert from "assert";
import jsdom from "jsdom-global";
import {
  testLabelData1,
  testLabelData10,
  testLabelData10r,
  testTitle1,
  testTitle2
} from "axis/AxisData.test";

jsdom();

describe("Axis", function() {
  for (let location in AxisLocation) {
    it(`Creates axis for location: ${
      AxisLocation[location]
    } (${location})`, function() {
      let at = new Axis({
        axis: AxisLocation[location]
      });
      assert(at.element instanceof HTMLElement);
    });
  }

  it(`Creates subelements`, function() {
    for (let testObj of [testLabelData10, testLabelData10r]) {
      let at = new Axis({
        title: testTitle1,
        numLabels: testObj.numLabels,
        range: testObj.range,
        flipDirection: testObj.flipDirection
      });

      let labelContainers = at.element.getElementsByClassName("pgAxisLabels");
      assert.equal(labelContainers.length, 1);
      let labelContainer = labelContainers[0];
      assert.equal(labelContainer.children.length, testObj.labels.length);
      for (let i = 0; i < testObj.labels.length; i++) {
        assert.equal(labelContainer.children[i].textContent, testObj.labels[i]);
      }

      let titleContainers = at.element.getElementsByClassName("pgAxisTitle");
      assert.equal(titleContainers.length, 1);
      let titleContainer = titleContainers[0];
      assert.equal(titleContainer.textContent, testTitle1);

      let scaleContainers = at.element.getElementsByClassName("pgAxisScale");
      assert.equal(scaleContainers.length, 1);
    }
  });

  it(`Updates title`, function() {
    let at = new Axis({
      title: testTitle1
    });
    assert.equal(
      testTitle1,
      at.element.getElementsByClassName("pgAxisTitle")[0].textContent
    );
    at.title = testTitle2;
    assert.equal(
      testTitle2,
      at.element.getElementsByClassName("pgAxisTitle")[0].textContent
    );
  });

  it(`Flips label direction `, function() {
    let at = new Axis({
      numLabels: testLabelData10.numLabels,
      range: testLabelData10.range,
      flipDirection: testLabelData10.flipDirection
    });

    let labelElements = at.element.getElementsByClassName("pgAxisLabels")[0]
      .children;
    for (let i = 0; i < labelElements.length; i++) {
      assert.equal(labelElements[i].textContent, testLabelData10.labels[i]);
    }

    at.flipDirection = true;
    labelElements = at.element.getElementsByClassName("pgAxisLabels")[0]
      .children;
    for (let i = 0; i < labelElements.length; i++) {
      assert.equal(labelElements[i].textContent, testLabelData10r.labels[i]);
    }
  });

  it(`Updates label range `, function() {
    let at = new Axis({
      numLabels: testLabelData10.numLabels,
      range: testLabelData10.range,
      flipDirection: testLabelData10.flipDirection
    });

    let labelElements = at.element.getElementsByClassName("pgAxisLabels")[0]
      .children;
    for (let i = 0; i < labelElements.length; i++) {
      assert.equal(labelElements[i].textContent, testLabelData10.labels[i]);
    }

    at.range = testLabelData1.range;

    labelElements = at.element.getElementsByClassName("pgAxisLabels")[0]
      .children;
    for (let i = 0; i < labelElements.length; i++) {
      assert.equal(labelElements[i].textContent, testLabelData1.labels[i]);
    }
  });

  it(`Rejects invalid axis locations`, function() {
    assert.throws(function() {
      new Axis({
        axis: "invalidLocation"
      });
    }, Error);
  });
});
