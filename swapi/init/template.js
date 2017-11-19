﻿const path = require("path");
const fs = require("fs");
module.exports = {
    name: "template",
    run: async function (app) {
        
		
		var ejs = require('ejs')
		var templates = {};
		
        var renderMid = function (req, res, next) {
            var renderView = function (file, data) {
				if (swapi.events && this.useEvents) {
					swapi.events.emit(`views.${file}.before`, {view: file, data: data, req: req, res:res} );
				}
				
				let propName= file.replace("/","__").replace('\\','__');
				if (!templates[propName]) {
					let fullName = path.resolve (swapi.config.locations.views + "/" + file + ".ejs");
					if (!fs.existsSync(fullName)) {
						throw Error("View file not found:" + fullName);
						return false;
					}
					templates[propName] = ejs.compile(fs.readFileSync(fullName).toString());
				}
				let result = templates[propName](data);
				if (swapi.events && this.useEvents) {
					swapi.events.emit(`views.${file}.after`, {view: file, data: data, req: req, res:res, result: result} );
				}
				res.end( result );
			};			
			
            res.render = renderView;
			next();
			
        };

		app.use(renderMid);
        
        console.log("(init) EJS Templating loaded from " + swapi.config.locations.views);
    }
}


