export default WebSocketJson;

/**
  * @constructor
  * @description
  * Data source which connects to a websocket server, parses a JSON object out of websocket frames, and calls data
  * handlers with the parsed object. This source can also respond to each frame received with a static value, allowing
  * servers to rate limit data based on how quickly the client can respond.
  *
  * Each WebSocketJson instance creates its own websocket connection.
  *
  * @param {WebSocketJson.Options} userOptions User provided options
  */
function WebSocketJson(options) {

  /**
    * @typedef WebSocketJson.Options
    *
    * @description
    * These are the options specific to this class.
    *
    * @property {String} type     Data source type. Must be "WebSocketJson",
    * @property {String} url      Websocket server url. (e.g. "ws://localhost:8001")
    * @property {String} ackFrame Optional value to send as an acknowledgement to the websocket server after each frame
    *                             is received. If this option is undefined, no acknowledgement will be sent.
    **/
  console.assert(options.type === "WebSocketJson");
  this._conn = new WebSocket(options.url);
  this._conn.binaryType = "arraybuffer";
  this._conn.onopen = this._onopen.bind(this);
  this._conn.onclose = this._onclose.bind(this);
  this._conn.onmessage = this._onmessage.bind(this);
  this._handlers = [];
  this._ackFrame = options.ackFrame;
}

WebSocketJson.prototype = {

  /**
   * Adds a handler function to be called when a websocket frame is received by this data source.
   *
   * @param {Function} handler function called with the websocket frame object as the single argument.
   */
  addHandler(handler) {
    /* Only add unique handlers */
    if (this._handlers.indexOf(handler) === -1) {
      this._handlers.push(handler);
    }
  },

  /**
   * Removes a registered handler function if it exists in this data source
   *
   * @param {Function} handler function to be removed
   */
  removeHandler(handler) {
    let index = this._handlers.indexOf(handler);
    if (index !== -1) {
      this._handlers.splice(index, 1);
    }
  },

  /**
   * @private
   * @description Handler for websocket onopen event
   */
  _onopen : function() {
    if (typeof this._ackFrame !== "undefined") {
      this._conn.send(this._ackFrame);
    }
  },

  /**
   * @private
   * @description Handler for websocket onmessage event
   */
  _onmessage : function(msg) {
    let json = JSON.parse(msg.data);

    for (let i = 0; i < this._handlers.length; i++) {
      this._handlers[i](json);
    }

    if (typeof this._ackFrame !== "undefined") {
      this._conn.send(this._ackFrame);
    }
  },

  /**
   * @private
   * @description Handler for websocket onclose event
   */
  _onclose : function() {
    /* pass */
  }
}