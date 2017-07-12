
module.exports = {
    name: "winston",
    run: async function (app) {


        var winston = require('winston');
        var path = require("path");

        global.sysLog = new (winston.Logger)({
            transports: [
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
                }),
                new (winston.transports.Console)({ timestamp: true })
            ]
        });
        console.log("(init) Winston loaded");
    }
}
