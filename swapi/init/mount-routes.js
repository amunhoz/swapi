//mount routes custom place
module.exports = {
  name: "mount-routes",
  run: async function (app) {
	const path = require("path");
    var mount = require('mount-routes');
    mount(app, global.swapi.config.locations.routesDir);
    console.log("(init) Express path route loaded from " + global.swapi.config.locations.routes);
  }
}
