//schedule solution
const path = require("path");
module.exports = {
    name: "schedule",
    run: async function (appExpress) {

        swapi.schedule = require('node-schedule');
        console.log("(init) swapi.schedule loaded");
    }
}


