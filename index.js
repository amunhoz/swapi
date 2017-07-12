const path = require('path');

const apiParam = path.resolve(__dirname, "./app/config/api.hjson"); 

var apiboot = require("./swapi/swapi");
apiboot.start(apiParam);

