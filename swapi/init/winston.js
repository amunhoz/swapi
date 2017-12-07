
module.exports = {
    name: "winston",
    run: async function (appExpress) {


        var winston = require('winston');
        var path = require("path");

        let transports = [
                new (winston.transports.File)({
                    name: 'info-file',
                    filename: path.resolve(__dirname, '../../data/sysInfo.log'),
                    level: 'info',
                    timestamp: true
                }),
                new (winston.transports.File)({
                    name: 'error-file',
                    filename: path.resolve(__dirname, '../../data/sysErr.log'),
                    level: 'error',
                    timestamp: true
                })
            ]
        if (app.config.debug) {
            transports.push(new (winston.transports.Console)({ timestamp: true }));
        }

        global.sysLog = new (winston.Logger)({
            transports: transports
        });
        console.log("(init) Winston loaded");
    }
}
