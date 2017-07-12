const path = require("path");
module.exports = {
    name: "marko",
    run: async function (app) {
        require('marko/node-require');

       
        var markoExpress = require('marko/express');
        require('marko/node-require').install();

        app.use(markoExpress());


        
        var renderMid = function (req, res, next) {

            var renderView = function (file, data) {
                var fs = require('fs');
                let fullFile = path.resolve(swapi.config.locations.views, file + ".marko");

                if (!fs.existsSync(fullFile)) {
                    throw Error("View file not found");
                    return false;
                }
                try {
                    var tpl = require(fullFile);
                    res.marko(tpl, data);
                }
                catch (e) {
                    throw Error(e);
                }
            }
            res.render = renderView;

            next();
        };

        app.use(renderMid);

        
        console.log("(init) Marko templating loaded");
    }
}


