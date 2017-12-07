var http = require('http');
var express = require('express');
const path = require('path');
const hjson = require('hjsonfile');


swapi = {};

exports.start = async function (apiFile) {

    console.log("(sys) Loading swapi with " + apiFile); 
    
    //creating global interface
    global.swapi = {}
    global.app = {}

    //deal with errors globbaly
    try {
        app.config = hjson.readFileSync(apiFile);

        let apiDir = path.dirname(apiFile); 
        app.config.baseDir = path.resolve(apiDir, app.config.baseDir);
        app.config.swapiDir = path.resolve(__dirname);

        //fill properly locations
        Object.keys(app.config.locations).forEach(function (key) {
            app.config.locations[key] = path.resolve(app.config.baseDir, app.config.locations[key]);
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
	const appExpress = express();
	var server = http.createServer(appExpress);
    
    
    swapi.express = appExpress;

	//load libraries
	var requireDir = require('require-dir');
	global.lib = {};
    global.lib = await requireDir(app.config.swapiDir + "/lib", { recurse: true });
    global.classes = await requireDir(app.config.swapiDir + "/classes", { recurse: true });
	console.log("(sys) Loading libraries and classes done.");
		
	//load boot services
    var bootFiles = new global.lib.bootDir();
    app.config.modules = hjson.readFileSync(app.config.locations.modulesFile);

	await bootFiles.start(  appExpress, 
                            path.resolve(__dirname, app.config.swapiDir + "/init"), 
                            app.config.modules );
    console.log("------------------------------------------------------------------------");
    console.log("(sys) Loading swapi init done.");

	//start express	
    server.listen(app.config.port, function () {
        console.log('(sys) ' + app.config.name + ' listening on port ' + app.config.port);
		app.config.host = server.address().address;
    });
    
}
