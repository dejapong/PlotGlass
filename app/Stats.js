export default Stats;

/**
 * @constructor
 * @description Helper class for internal PlotGlass stats
 */
function Stats() {
  this.frames = 0;
};

Stats.prototype = {

  /**
   * Start an interval that records stats periodically
   *
   * @param {Number} intervalSecs Seconds between stat computatino
   * @param {String} label String to print as part of console log
   * @param {Boolean} log Set true if stats should print out to console
   */
  startFpsInterval: function(intervalSecs = 0, label="FPS", log=false) {
    if (intervalSecs) {
      this.stopFpsInterval();
      this.startTime = (new Date()).getTime();
      this.frames = 0;
      this.interval = setInterval(()=>{
        this.fps = this.getFps(true).toFixed(2);
        if (log) {
          console.log(label, this.fps);
        }
      },intervalSecs * 1000);
    }
  },

  /**
   * Stop any existing stats periodic
   */
  stopFpsInterval: function() {
    clearInterval(this.interval);
  },

  /** Record a render frame */
  recordFrame: function() {
    this.frames++;
  },

  /**
   * Get the average frames per second during the current collection period
   * @param {Boolean} reset Reset stats for this period
   **/
  getFps: function(reset = false) {
    let now = (new Date()).getTime();
    let elapsed = now - this.startTime;
    let fps = this.frames * 1000 / elapsed;
    if (reset) {
      this.resetFps(now);
    }
    return fps;
  },

  /**
   * Reset stats for the current collection period
   */
  resetFps: function(startTime) {
    this.startTime = startTime;
    this.frames = 0;
  }
}