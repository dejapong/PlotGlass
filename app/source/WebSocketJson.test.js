import WebSocketJson from "source/WebSocketJson"
import { WebSocket, Server, SocketIO } from 'mock-socket';
import assert from "assert"

global.WebSocket = WebSocket;

function createWatchdog(done, mockServer, maxMs) {
  return setTimeout(function(done, mockServer) {
    assert.fail("Failed to receive connection from client");
    mockServer.stop(done);
  }.bind(this, done, mockServer), maxMs);
}

describe("WebSocketJson", function() {

  it(`Creates instance`, function(done) {

    const mockServer = new Server('ws://localhost:8001');
    let watchdog = createWatchdog(done, mockServer, 300);

    mockServer.on('connection', function() {
      mockServer.stop(done);
      clearTimeout(watchdog);
    });

    let inst = new WebSocketJson({
      type: "WebSocketJson",
      url: "ws://localhost:8001",
      ackFrame: "",
    });

  });

  it("Calls Handlers", function(done){

    const mockServer = new Server('ws://localhost:8001');
    let connection = 0;
    let watchdog = createWatchdog(done, mockServer, 300);
    let message = {"a":1, "b":2};

    let inst = new WebSocketJson({
      type: "WebSocketJson",
      url: "ws://localhost:8001",
      ackFrame: "",
    });

    inst.addHandler(function(frame){
      assert.equal(frame.a, message.a);
      assert.equal(frame.b, message.b);
      mockServer.stop(done);
      clearTimeout(watchdog);
    });

    mockServer.send(JSON.stringify(message));

  });

});