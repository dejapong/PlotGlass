let JsDocPlugin = require('jsdoc-webpack-plugin-v2');
var path = require('path');

module.exports = {
  context: __dirname + "/app",
  entry: "./index.js",
  output: {
    path: __dirname + "/dist",
    filename: "plotGlass.js"
  },
  resolve: {
    modules: ["app", "node_modules"],
    extensions: [ ".js"]
  },
  plugins: [
  new JsDocPlugin({
    conf: path.join(__dirname, 'jsdoc.config.json')
  })]
}