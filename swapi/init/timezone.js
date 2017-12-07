﻿var path = require('path');
var requireDir = require('require-dir');

module.exports = {
  name: "timezone",
  run: async function (appExpress) {
 	  if (app.config.timezone) {
          const setTZ = require('set-tz')
          setTZ(app.config.timezone)
		  console.log("(init) Timezone defined to " + app.config.timezone);  
      }
  }
}

