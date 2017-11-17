const path = require("path");
const fs = require("fs");
module.exports = {
    name: "marko",
    run: async function (app) {
        
		var swig  = require('swig');
		var templates = {};
		
        
        var renderMid = function (req, res, next) {

            var renderView = function (file, data) {
				let propName= file.replace("/","__").replace('\\','__');
				if (!templates[propName]) {
					let fullName = path.resolve (swapi.config.locations.views + "/" + file + ".html");
					if (!fs.existsSync(fullName)) {
						throw Error("View file not found:" + fullName);
						return false;
					}
					try {
						templates[propName] = swig.compileFile(fullName);
					}
					catch (e) {
						throw Error(e);
						return false;
					}
				}
				res.send(templates[propName](data));
   
			};
				
            res.render = renderView;
			next();
			
        };

        app.use(renderMid);

        
        console.log("(init) Swig templating loaded");
    }
}


