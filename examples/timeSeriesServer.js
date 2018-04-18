/**
 * Run this from a local console to start a WebSocket server to fake realtime data for timeSeries.html
 * **/

var ws = require("nodejs-websocket");

let testObject = {

  timeArr : [0,0,0,0],
  acclArr : [0,0,0,0],

  acclObj : {
    time : 0,
    value : 0,
  },

  acclArrObj : {
    time : [0,0,0,0],
    value : [0,0,0,0],
  },

  acclArrObj : {
    time : [0,0,0,0],
    value : [0,0,0,0],
  },

};

let data = {
  time : 0,
  accelX : 0.0,
}

let startTime = (new Date()).getTime();
let msgsSent = [];
let msgsPerSec = [];
let connectionCount = 0;

setInterval(function(){
  let now = (new Date()).getTime();
  let elapsed = now - startTime;

  for ( let i =0; i < connectionCount; i++) {
    msgsPerSec[i] = (msgsSent[i] * 1000 / elapsed).toFixed(2);
    msgsSent[i] = 0;
  }

  process.stdout.write(`\rMessages Per Second: ${msgsPerSec.join('\t')}`);
  startTime = now;
}, 1000);

var server = ws.createServer(function (conn) {

  let connnectionIndex = connectionCount;
  connectionCount++;

  msgsSent.push(0);
  msgsPerSec.push(0);

  var x = 0;
  setInterval(function(){
    x +=.001;
  }, 10);

  conn.on("text", function (str) {
    data.time = new Date().getTime() / 1000;
    data.accelX = 1 + /*1 * Math.random() - 0.5 */+ Math.sin((x)*30);
    msgsSent[connnectionIndex]++;
    conn.sendText(JSON.stringify(data));
  });

  conn.on("close", function (code, reason) {
    console.log("Connection closed");
  })

  conn.on('error', function(code, reason){
    console.log('error', code, reason);
  });

}).listen(8001);