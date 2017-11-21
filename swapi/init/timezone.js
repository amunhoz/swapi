var path = require('path');
var requireDir = require('require-dir');

module.exports = {
  name: "timezone",
  run: async function (app) {
 	  if (swapi.config.timezone) {
          const setTZ = require('set-tz')
          setTZ(swapi.config.timezone)
		  console.log("(init) Timezone defined to " + swapi.config.timezone);  
      }
  }
}

