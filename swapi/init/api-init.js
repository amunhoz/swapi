var path = require('path');
var requireDir = require('require-dir');

module.exports = {
  name: "api-init",
  run: async function (app) {
      if (swapi.config.timezone) {
          const setTZ = require('set-tz')
          setTZ(swapi.config.timezone)
      }
        

      global.swapi.lib = await requireDir(swapi.config.locations.libs);
      console.log("  -> Loading api libraries done.");			


      global.swapi.security = await requireDir(swapi.config.locations.security);
      console.log("  -> Loading security libs done.");			


	  var bootFiles = new global.lib.bootDir();
      await bootFiles.start(app, path.resolve(swapi.config.locations.init));
      console.log("  -> Loading api init done.");

      console.log("(init) Api init thingsloaded");  

  }
}

