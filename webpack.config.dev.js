let nodeExternals = require('webpack-node-externals');
var path = require('path');

module.exports = {
  target: 'node',
  externals: [ nodeExternals() ],
  context: __dirname + "/app",
  entry: "./index.js",
  output: {
    path: __dirname + "/dist",
    filename: "plotGlass.js"
  },
  resolve: {
    modules: ["app"],
    extensions: [ ".js"]
  }
}