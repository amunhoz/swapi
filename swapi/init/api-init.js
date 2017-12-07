var path = require('path');
var requireDir = require('require-dir');

module.exports = {
  name: "api-init",
  run: async function (appExpress) {

      app.lib = await requireDir(app.config.locations.libs, { recurse: true });
      console.log("  -> Loading api libraries done.");			


      app.security = await requireDir(app.config.locations.security);
      console.log("  -> Loading security libs done.");			


	  var bootFiles = new global.lib.bootDir();
      await bootFiles.start(appExpress, path.resolve(app.config.locations.init));
      console.log("  -> Loading api init done.");

      console.log("(init) Api init thingsloaded");  

  }
}

