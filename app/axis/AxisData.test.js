/*
 * Shared data for axis element unit testing
 */

/*
 * Expected axis labels for a given range and number of labels
 */
export var testLabelData10 = {
  range: [-10, 10],
  numLabels: 9,
  flipDirection: false,
  labels: [
    "-10.00",
    "-7.50",
    "-5.00",
    "-2.50",
    "0.00",
    "2.50",
    "5.00",
    "7.50",
    "10.00"
  ]
};

/*
 * Expected axis labels for a given range and number of labels
 */
export var testLabelData10r = {
  range: [-10, 10],
  numLabels: 9,
  flipDirection: true,
  labels: [
    "10.00",
    "7.50",
    "5.00",
    "2.50",
    "0.00",
    "-2.50",
    "-5.00",
    "-7.50",
    "-10.00"
  ]
};

/*
 * Expected axis labels for a given range and number of labels
 */
export var testLabelData1 = {
  range: [-1, 1],
  numLabels: 9,
  flipDirection: false,
  labels: [
    "-1.00",
    "-0.75",
    "-0.50",
    "-0.25",
    "0.00",
    "0.25",
    "0.50",
    "0.75",
    "1.00"
  ]
};

export var testTitle1 = "Test Title 1";
export var testTitle2 = "Test Title 2";
