import { mat4 } from "gl-matrix";
import Element from "Element";

export default DrawRegion;

/**
 * @constructor
 * @description Region which tracks the box that is visible, even when nested in other elements. It sets up the webGl
 * viewport and scissor regions appropriately.
 * @extends Element
 */
function DrawRegion(userOptions) {
  /**
   * @typedef DrawRegion.Options
   * @description Extends {@link Element.Options}
   */
  let options = Object.assign(
    {
      /* No Default Options */
    },
    userOptions
  );

  Element.call(this, options);
  this.viewportRegion = {};
  this.scissorRegion = {};
  this.computeClipping();
}

DrawRegion.prototype = Object.assign(Object.create(Element.prototype), {
  /**
   * @memberof DrawRegion
   * @instance
   * @description
   * This method should be called by all subclasses, as it sets the gl viewport and scissor.
   */
  draw: function(gl) {
    gl.viewport(
      this.viewportRegion.x,
      this.viewportRegion.y,
      this.viewportRegion.width,
      this.viewportRegion.height
    );
    gl.scissor(
      this.scissorRegion.x,
      this.scissorRegion.y,
      this.scissorRegion.width,
      this.scissorRegion.height
    );
  },

  scroll: function() {
    this.computeClipping();
  },

  resize: function() {
    this.computeClipping();
  },

  /**
   * @memberof DrawRegion
   * @instance
   * @description
   * Compute viewport and scissor regions, taking into account borders and scrollbars
   **/
  computeClipping: function() {
    let bounds = this.element.getBoundingClientRect();
    let maxTop = bounds.top;
    let maxLeft = bounds.left;
    let minRight = bounds.right;
    let minBottom = bounds.bottom;
    let parent = this.element.parentElement;

    /** @todo Border and maybe scrollbar widths can probably be cached to some degree. At least the user should be able
    to set an option that caches or effectively skips this feature if they care more about performance than a
    dynamic page layout */
    while (parent && parent != document.body) {
      let bounds = parent.getBoundingClientRect();
      let scrollbarWidth = parent.offsetWidth - parent.clientWidth;
      let scrollbarHeight = parent.offsetHeight - parent.clientHeight;
      let pStyle = getComputedStyle(parent);
      let leftBorder = parseInt(pStyle["border-left-width"]);
      let topBorder = parseInt(pStyle["border-top-width"]);

      maxTop = Math.max(maxTop, bounds.top + topBorder);
      maxLeft = Math.max(maxLeft, bounds.left + leftBorder);
      minRight = Math.min(minRight, bounds.right - scrollbarWidth + leftBorder);
      minBottom = Math.min(
        minBottom,
        bounds.bottom - scrollbarHeight + topBorder
      );
      parent = parent.parentElement;
    }

    this.scissorRegion = {
      x: maxLeft,
      y: window.innerHeight - maxTop - Math.max(0, minBottom - maxTop),
      /* Webgl starts y=0 at bottom left of screen and y increases upwards, where scissorRegion assumes it's
       * in the top left. and increases downwards */
      height: Math.max(0, minBottom - maxTop),
      width: Math.max(0, minRight - maxLeft)
    };

    this.viewportRegion = {
      x: bounds.left,
      y: window.innerHeight - bounds.bottom,
      height: Math.max(0, bounds.bottom - bounds.top),
      width: Math.max(0, bounds.right - bounds.left)
    };
  }
});
