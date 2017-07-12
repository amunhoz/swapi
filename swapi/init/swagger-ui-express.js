const path = require("path");

module.exports = {
  name: "swagger-ui-express",
  run: async function (app) {
      if (swapi.config.debug) {
          const swaggerUi = require('swagger-ui-express');
          const swaggerDocument = require(swapi.config.locations.swaggerFile);
          swaggerDocument.host = global.swapi.config.host + ':' + global.swapi.config.port;
          app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
          console.log("(init) Swagger Ui Express loaded");
      }
  }
}
