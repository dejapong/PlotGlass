import Axis from "axis/Axis";
import {AxisLocation} from "axis/AxisDefs";
import PlotBody from "plot/PlotBody";
import {appendNewDiv, mergeOptions} from "Util";
import Element from "Element";
import cfg from "Config";

export default PlotView;

/**
 * @constructor
 * @description View for plot
 */
function PlotView(userOptions) {

  let options = mergeOptions({
    body: {}
  }, userOptions);

  Element.call(this, options);

  this._titleText = options.title;
  this._axisContainers = {};
  this._plotBody = null;
  this._plotBodyContainer = null;
  this._titleElement = appendNewDiv(this.element, {class:"pgPlotTitle"});
  this._axisContainers[AxisLocation.X_AXIS_TOP] = appendNewDiv(this.element, {
    class:"pgAxesContainer",
    style:{
      display:"flex",
      flexDirection:"column"
    }
  });

  this._plotBodyContainer = appendNewDiv(this.element, {
    class:"pgPlotBodyContainer",
    style:{
      display:"flex",
    }
  });

  this._axisContainers[AxisLocation.Y_AXIS_LEFT] = appendNewDiv(this._plotBodyContainer, {
    class:"pgAxesContainer",
    style:{
      minWidth:"1em",
      display:"flex",
    }
  });

  this._plotBody = new PlotBody(options.body);
  this._plotBodyContainer.appendChild(this._plotBody.element);

  this._axisContainers[AxisLocation.Y_AXIS_RIGHT] = appendNewDiv(this._plotBodyContainer, {
    class:"pgAxesContainer",
    style:{
      minWidth:"1em",
      display:"flex",
    }
  });

  this._axisContainers[AxisLocation.X_AXIS_BOTTOM] = appendNewDiv(this.element, {
    class:"pgAxesContainer",
    style:{
      display:"flex",
      flexDirection:"column"
    }
  });

  this.add(this._plotBody);
  this.setTitle(this._titleText);

}

PlotView.prototype =  Object.assign({}, Element.prototype, {

  resize : function() {
    let bounds = this.element.getBoundingClientRect()
    let width = bounds.right - bounds.left;
    let height = bounds.bottom - bounds.top;

    let titleBounds =  this._titleElement.getBoundingClientRect();
    let titleHeight = titleBounds.bottom - titleBounds.top;

    let yAxesContainerLeft = this._axisContainers[AxisLocation.Y_AXIS_LEFT];
    let yAxesContainerRight = this._axisContainers[AxisLocation.Y_AXIS_RIGHT];
    let xAxesContainerTop = this._axisContainers[AxisLocation.X_AXIS_TOP];
    let xAxesContainerBottom = this._axisContainers[AxisLocation.X_AXIS_BOTTOM];

    let yAxesContainerLeftWidth = yAxesContainerLeft.getBoundingClientRect().width;
    let yAxesContainerRightWidth = yAxesContainerRight.getBoundingClientRect().width;
    let xAxesContainerTopHeight = xAxesContainerTop.getBoundingClientRect().height;
    let xAxesContainerBottomHeight = xAxesContainerBottom.getBoundingClientRect().height;

    let pStyle = getComputedStyle(this.element);
    let leftBorder = parseInt(pStyle["border-left-width"]);
    let rightBorder = parseInt(pStyle["border-right-width"]);
    let topBorder = parseInt(pStyle["border-top-width"]);
    let bottomBorder = parseInt(pStyle["border-bottom-width"]);

    let plotBodyWidth = Math.floor(width - yAxesContainerLeftWidth - yAxesContainerRightWidth - leftBorder - rightBorder);
    let plotBodyHeight = Math.floor(height - xAxesContainerTopHeight - xAxesContainerBottomHeight - topBorder - bottomBorder - titleHeight);

    Object.assign(this._titleElement.style, {
      width:"100%",
      textAlign:"center",
    });

    Object.assign(xAxesContainerTop.style, {
      width: `${plotBodyWidth}px`,
      marginLeft: `${yAxesContainerLeftWidth}px`
    });

    Object.assign(this._plotBodyContainer.style, {
      width: `100%`,
      height: `${plotBodyHeight}`,
    });

    Object.assign(yAxesContainerLeft.style, {
      height: `${plotBodyHeight}px`,
    });

    Object.assign(this._plotBody.element.style, {
      width: `${plotBodyWidth}px`,
      height: `${plotBodyHeight}px`,
    });

    Object.assign(yAxesContainerRight.style, {
      height: `${plotBodyHeight}px`,
    });

    Object.assign(xAxesContainerBottom.style, {
      width: `${plotBodyWidth}px`,
      marginLeft: `${yAxesContainerLeftWidth}px`,
    });
  },

  /**
   * @memberof PlotView
   * @instance
   * @description
   * Set the text of the plot's title
   * @param {string} value Text of plot title
   */
  setTitle:function(value){
    this._titleText = value;
    this._titleElement.innerHTML = value;
  },

  /**
   * @memberof PlotView
   * @instance
   * @return Text of plot title
   */
  getTitle:function(){
    return this._titleText;
  },
});