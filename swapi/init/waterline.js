﻿var waterline = require('waterline');
var path = require('path');
var fs = require('fs');

module.exports = {
    name: "waterline",
    run: async function () {


        var orm = new waterline();
        let config = require(app.config.locations.connections); //ERROR


        let fullPath = app.config.locations.models;

        app._models = {};
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




        app._models = orm.collections;

        //creating model interfaces
        app.models = {};
        for (item in app._models) {
            app.models[item] = new swapi.classes.iModel(item);
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
                console.log("       Waterline full loaded.");
            }
        });

    });

}