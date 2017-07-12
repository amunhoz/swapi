var waterline = require('waterline');
var path = require('path');
var fs = require('fs');

module.exports = {
    name: "waterline",
    run: async function (app) {


        var orm = new waterline();
        let config = require(global.swapi.config.locations.connections); //ERROR


        let fullPath = global.swapi.config.locations.models;

        swapi.models = {};
        var files = fs.readdirSync(fullPath);
        files.forEach(function (f) {
            var extension = path.extname(f);
            if (extension == ".js") {
                let modelInfo = require(path.resolve(fullPath, f));
                let model = waterline.Collection.extend(modelInfo);
                orm.loadCollection(model);
            }
        });

        await waitForOrm(orm, config);




        swapi.models = orm.collections;

        //creating model interfaces
        swapi.imodels = {};
        for (item in swapi.models) {
            swapi.imodels[item] = new classes.iModel(item);
        }
        
        swapi.waterline = orm;

    }
};



async function waitForOrm(orm, config) {

    return new Promise((resolve, reject) => {

        orm.initialize(config, function (err, models) {
            if (err) reject(err);
            else {
                resolve()
                console.log("(init) Waterline loaded");
            }
        });

    });

}