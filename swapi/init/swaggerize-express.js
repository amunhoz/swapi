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
        
        //custom error for validation problems
        app.use(function (err, req, res, next) {
            //deal with swagger validation errors
            if (err.name == "ValidationError") {
                //yeap
                let resp = { error: {code:  "err_input_validation", message: "Erro de validação de dados.", details: `Campo '${err.details[0].context.key}' espera formato '${err._object.short_name}'`, stack: err.stack} }
                res.status(400).send(resp);
            }
            next(err); //dont keep going
        })


        app.swagger.api.host = swapi.config.host + ':' + swapi.config.port;
        
        console.log("(init) Swagger express routes loaded");
	  
  }
}
