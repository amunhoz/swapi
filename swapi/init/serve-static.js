//to serve static files
module.exports = {
  name: "serve-static",
  run: async function (app) {
	var path=require("path");
    var serveStatic = require('serve-static')
    app.use(serveStatic(path.resolve(__dirname, "/../../api/public"), { 'index': ['default.html', 'default.htm'] }))
    console.log("(init) Server static loaded");

	
  }
}
