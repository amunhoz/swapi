const swaggerize = require('swaggerize-express');
const path = require("path");

module.exports = {
  name: "swaggerize-express",
  run: async function (app) {
        
		
		// set options
		var opt = {
		  // path of api doc
            api: require(swapi.config.locations.swaggerFile),
		  // dir of things
          handlers: swapi.config.locations.routesApi,
          basedir: swapi.config.baseDir,
          security: swapi.config.locations.security,
		  docspath: '/api-docs'
		};
		
        try {
            app.use(swaggerize(opt));
        } catch (err) {
            // Handle the error here.
            console.error("Error on loading swagger routes from file, check your route files or your check your file syntax in " + swapi.config.locations.swaggerFile);
            console.log(err);
        }
		

        app.swagger.api.host = swapi.config.host + ':' + swapi.config.port;
        
        console.log("(init) Swagger express routes loaded");
	  
  }
}
