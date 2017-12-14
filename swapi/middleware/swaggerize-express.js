﻿const swaggerize = require('swaggerize-express');
const path = require("path");

module.exports = {
  name: "swaggerize-express",
  run: async function (appExpress) {
        
		
		// set options
		var opt = {
		  // path of api doc
        api: require(app.config.locations.swaggerFile),
		  // dir of things
          handlers: app.config.locations.routesApi,
          basedir: app.config.baseDir,
          security: app.config.locations.security,
		  docspath: '/api-docs'
		};
		
        try {
            appExpress.use(swaggerize(opt));
        } catch (err) {
            // Handle the error here.
            console.error("Error on loading swagger routes from file, check your route files or your check your file syntax in " + app.config.locations.swaggerFile);
            console.log(err);
        }
        
        //custom error for validation problems
        appExpress.use(function (err, req, res, next) {
            //deal with swagger validation errors
            if (err.name == "ValidationError") {
                //yeap
                let resp = { error: {code:  "err_input_validation", message: "Erro de validação de dados.", details: `Campo '${err.details[0].context.key}' espera formato '${err._object.short_name}'`, stack: err.stack} }
                res.status(400).send(resp);
            } else {
                next(err); //dont keep going
            }
            
        })


        appExpress.swagger.api.host = app.config.host + ':' + app.config.port;
        
	  
  }
}
