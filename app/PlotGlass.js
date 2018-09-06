import DrawRegion from "DrawRegion";
import Stats from "Stats";
import cfg from "Config";
export default PlotGlass;

/**
 * @constructor
 * @description
 *
 * This class creates a webGl context which is transparent to mouse clicks, sizes and positions it to cover the entire
 * browser window. The webGl context is referred to as "glass", and it's position is fixed - it does not scroll with the
 * document.
 *
 */
function PlotGlass() {
  /** List of DOM elements to render within */
  this._plots = [];
  this._running = false;
  this._stats = new Stats();
}

PlotGlass.prototype = {
  /**
   * Add a plot to render.
   * @param element   Dom element to serve as the bounds for rendering
   * @param plot  PlotGlass DrawRegion to render on the element bounds
   */
  add: function(plot) {
    this._plots.push(plot);

    let parent = plot.element.parentElement;
    while (parent) {
      /** @todo dedupe events */
      parent.addEventListener("scroll", this.scroll.bind(this));
      parent = parent.parentElement;
    }

    this.resize();
  },

  start: function() {
    /* Place a canvas over the whole screen */
    this.canvas = document.createElement("canvas");
    Object.assign(this.canvas.style, {
      position: "fixed",
      top: "0px",
      left: "0px",
      bottom: "0px",
      right: "0px",
      zIndex: "1000",
      pointerEvents: "none"
    });
    document.body.append(this.canvas);

    let resizeTimeout = null;
    window.addEventListener("scroll", this.scroll.bind(this));
    window.addEventListener("resize", () => {
      this.resize();
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(this.resize.bind(this), 300);
    });

    let gl = (this.gl = this.canvas.getContext("webgl", {
      preserveDrawingBuffer: false
    }));
    gl.enable(gl.SCISSOR_TEST);
    gl.clearColor.apply(gl, cfg.CLEAR_COLOR);
    gl.clearDepth(1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.resize();
    this._stats.startFpsInterval(5);
    this._running = true;
    window.requestAnimationFrame(this._render.bind(this));
  },

  resize: function() {
    if (!this.canvas) {
      /* ignore resize events before canvas is loaded */
      return;
    }

    Object.assign(this.canvas.style, {
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`
    });

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    for (let i = 0; i < this._plots.length; i++) {
      let plot = this._plots[i];
      for (let j = 0; j < plot._resizeList.length; j++) {
        plot._resizeList[j].resize();
      }
    }
  },

  scroll: function() {
    for (let i = 0; i < this._plots.length; i++) {
      let plot = this._plots[i];
      for (let j = 0; j < plot._scrollList.length; j++) {
        plot._scrollList[j].scroll();
      }
    }
  },

  _render: function() {
    for (let i = 0; i < this._plots.length; i++) {
      let plot = this._plots[i];
      for (let j = 0; j < plot._drawList.length; j++) {
        plot._drawList[j].draw(this.gl);
      }
    }

    if (this._running) {
      window.requestAnimationFrame(this._render.bind(this));
    }

    this._stats.recordFrame();
  },

  /**
   * Clear the entire screen.
   */
  _clearScreen: function() {
    this.gl.disable(this.gl.SCISSOR_TEST);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.SCISSOR_TEST);
  }
};
