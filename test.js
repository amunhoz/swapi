		const path = require("path");
		const fs = require("fs");
		
		var EJS = require('ejs')
		var templates = {};
		
		
		
		var renderView = function (file, data) {
				let propName= file.replace("/","__").replace('\\','__');
				if (!templates[propName]) {
					let fullName = file; // path.resolve (swapi.config.locations.views + "/" + file + ".ejs");
					if (!fs.existsSync(fullName)) {
						throw Error("View file not found:" + fullName);
						return false;
					}
					console.log(fullName);
					try {
						templates[propName] = new EJS({url: fullName}) ;
					}
					catch (e) {
						throw Error(e);
						return false;
					}
				}
				return(templates[propName].render(data));
   
			};
			
			console.log(renderView("./app/views/testView.ejs", {message:"oi"}));
			
			//d:\gDrive\_prog\git\swapi_github\app\views