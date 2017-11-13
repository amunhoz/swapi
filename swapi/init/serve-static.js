//to serve static files
module.exports = {
  name: "serve-static",
  run: async function (app) {
	  var path=require("path");
    var serveStatic = require('serve-static')
    var dir = swapi.config.locations.static;
    app.use(serveStatic(dir, { 'index': ['default.html', 'default.htm'] }))
    console.log("(init) Server static loaded");

	
  }
}
