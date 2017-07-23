
module.exports = {
    name: "express-async-error",
    run: async function (app) {

        require('express-async-errors');
        console.log("(init) Express async errors loaded");
    }
}
