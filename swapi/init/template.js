const path = require("path");
const fs = require("fs");
module.exports = {
    name: "template",
    run: async function (app) {
        
		
		var ejs = require('ejs')
		var templates = {};
		
        var renderMid = function (req, res, next) {
            var renderView = function (file, data) {

				let propName= file.replace("/","__").replace('\\','__');
				if (!templates[propName]) {
					let fullName = path.resolve (swapi.config.locations.views + "/" + file + ".ejs");
					if (!fs.existsSync(fullName)) {
						throw Error("View file not found:" + fullName);
						return false;
					}
					try {
						templates[propName] = ejs.compile(fs.readFileSync(fullName).toString());
					}
					catch (e) {
						throw Error(e);
						return false;
					}
				}
				res.end( templates[propName](data) );
			};			
            res.render = renderView;
			next();
			
        };

		app.use(renderMid);
        
        console.log("(init) EJS Templating loaded from " + swapi.config.locations.views);
    }
}


