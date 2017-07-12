//queue solution for all
const path = require("path");
module.exports = {
    name: "bull",
    run: async function (app) {
        var queue = require('queue');

        swapi.queue = queue();
        swapi.queue.concurrency = swapi.config.modules.queue.config.concurrency;
        swapi.queue.autostart = true;
        console.log("(init) swapi.queue loaded");
    }
}


