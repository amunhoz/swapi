//queue solution for all
const path = require("path");
module.exports = {
    name: "cache-manager",
    run: async function (appExpress) {
		var cacheManager = require('cache-manager');
		let options = app.config.modules["cache-manager"].options;
        swapi.cache = cacheManager.caching(options);
        console.log("(init) swapi.cache loaded");
    }
}


