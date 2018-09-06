import Plot from "plot/Plot";
import Axis from "axis/Axis";
import Series from "series/Series";

import WebSocketJson from "source/WebSocketJson";
import assert from "assert";
import { testTitle1, testTitle2 } from "axis/AxisData.test";

describe("Plot", function() {
  it(`Creates and updates title`, function() {
    let plot = new Plot({
      title: testTitle1
    });
    let titleElements = plot.element.getElementsByClassName("pgPlotTitle");
    assert.equal(titleElements.length, 1);
    let titleElement = titleElements[0];
    assert.equal(titleElement.textContent, testTitle1);

    plot.title = testTitle2;
    assert.equal(
      plot.element.getElementsByClassName("pgPlotTitle")[0].textContent,
      testTitle2
    );
  });

  it(`Creates and updates axes`, function() {
    let plot = new Plot({
      axes: {
        x1: {
          axis: "xBottom",
          range: [0, 5],
          title: "X1 Time (s)"
        },
        y1: {
          axis: "yLeft",
          range: [0, 5],
          title: "Y1 Time (s)"
        }
      }
    });

    assert(plot.axes.x1 instanceof Axis);
    assert(plot.axes.y1 instanceof Axis);

    plot.axes = {
      x2: {
        axis: "xBottom",
        range: [0, 5],
        title: "X1 Time (s)"
      },
      y2: {
        axis: "yLeft",
        range: [0, 5],
        title: "Y1 Time (s)"
      }
    };

    assert(plot.axes.x2 instanceof Axis);
    assert(plot.axes.y2 instanceof Axis);
  });

  it(`Creates and updates sources`, function() {
    let plot = new Plot({
      sources: {
        source1: {
          type: "WebSocketJson",
          url: "dummy"
        },
        source2: {
          type: "WebSocketJson",
          url: "dummy"
        }
      }
    });

    assert(plot.sources.source1 instanceof WebSocketJson, "Testing source1");
    assert(plot.sources.source2 instanceof WebSocketJson, "Testing source2");

    plot.sources = {
      source3: {
        type: "WebSocketJson",
        url: "dummy"
      },
      source4: {
        type: "WebSocketJson",
        url: "dummy"
      }
    };

    assert(plot.sources.source3 instanceof WebSocketJson, "Testing source3");
    assert(plot.sources.source4 instanceof WebSocketJson, "Testing source4");
  });

  it(`Creates series`, function() {
    let plot = new Plot({
      axes: {
        x1: {
          axis: "xBottom",
          range: [0, 5],
          title: "X1 Time (s)"
        },
        y1: {
          axis: "yLeft",
          range: [0, 5],
          title: "Y1 Time (s)"
        }
      },
      series: {
        series0: {
          type: "time",
          title: "Test Series 1",
          axes: ["x1", "y1"],
          source: {
            name: "source1",
            time: "$(time)",
            value: "accelX"
          },
          vertical: false,
          color: [1.0, 0.0, 0.75, 1.0]
        }
      }
    });

    assert(plot.series.series0 instanceof Series);

    plot.series = {
      series1: {
        type: "time",
        title: "Test Series 1",
        axes: ["x1", "y1"],
        source: {
          name: "source1",
          time: "$(time)",
          value: "accelX"
        },
        vertical: false,
        color: [1.0, 0.0, 0.75, 1.0]
      }
    };

    assert(plot.series.series1 instanceof Series);
  });
});
