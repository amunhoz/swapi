var http = require('http');
var express = require('express');
const path = require('path');
const hjson = require('hjsonfile');


global.swapi = {};

exports.start = async function (apiFile) {

    console.log("(sys) Loading swapi with " + apiFile); 

    //deal with errors globbaly
    try {
        swapi.config = hjson.readFileSync(apiFile);

        let apiDir = path.dirname(apiFile); 
        swapi.config.baseDir = path.resolve(apiDir, swapi.config.baseDir);
        global.swapi.config.swapiDir = path.resolve(__dirname);

        //fill properly locations
        Object.keys(global.swapi.config.locations).forEach(function (key) {
            global.swapi.config.locations[key] = path.resolve(swapi.config.baseDir, global.swapi.config.locations[key]);
        });
        //start system
        await bootApi();
    }
    catch (ex) {
        //error loading api file;
        console.error(ex);
    }

};


async function bootApi() {
    const app = express();
	var server = http.createServer(app);
    global.app = app;
    

	//load libraries
	var requireDir = require('require-dir');
	global.lib = {};
    global.lib = await requireDir(swapi.config.swapiDir + "/lib", { recurse: true });
    global.classes = await requireDir(swapi.config.swapiDir + "/classes", { recurse: true });
	console.log("(sys) Loading libraries and classes done.");
		
	//load boot services
    var bootFiles = new global.lib.bootDir();
    swapi.config.modules = hjson.readFileSync(swapi.config.locations.modulesFile);

	await bootFiles.start(  app, 
                            path.resolve(__dirname, swapi.config.swapiDir + "/init"), 
                            swapi.config.modules );
    console.log("------------------------------------------------------------------------");
    console.log("(sys) Loading swapi init done.");

	//start express	
    server.listen(global.swapi.config.port, function () {
        console.log('(sys) ' + swapi.config.name + ' listening on port ' + global.swapi.config.port);
		global.swapi.config.host = server.address().address;
    });
    
}
