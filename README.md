## What is PlotGlass?

PlotGlass is a plotting library for plotting realtime data at reasonable frame rates, with many plots on one page.

## Can I try it?

[To see a live example, click here](http://138.68.49.21:/timeSeriesClientOnly.html).

[For full documentation, click here](http://138.68.49.21).

To build `plotGlass.js`, just run `webpack` in the base directory. This will build JsDoc documentation as well, which should show up in the `./docs` directory.

To run unit tests, run `npm run test`

To run the local, websocket example, you'll need to start the local websocket server. From the project root, run `node examples/timeSeriesServer.js`

Then open `examples/timeSeries.html` in a web browser.

## How does it work?
PlotGlass uses webGl to achieve its performance, avoiding extra overhead from SVG or Canvas techniques. Since most browsers limit the number of webGl contexts per page, and to avoid the overhead of multiple webGl contexts, PlotGlass uses a single webGl context to draw all plots.

It sizes its webGl context to cover the entire browser window, and tracks the window's scroll position, and the visible region of each plot.

## How well does it perform?

To give a coarse idea of the expected performance: in one browser window, PlotGlass should be able to render 100 plots, each with a single time series containing 100k data points, updating at at least 15hz, while page scrolling and interaction remains fluid (> 30fps). This should be possible on a 2017 Macbook Air.

## How developed is it?
This project is still a proof-of-concept. The current version is demonstrates TimeSeries plots, with JSON websocket data only. The API is still in flux and future versions may break everything.

## Can I contribute?
That would be amazing! I'll review pull requests, or contact me ([github.com/dejapong]), if you'd like a specific issue to work on.
