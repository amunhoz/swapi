//This file will be executed every time the system boot
//it will follow the order defined in 'priority' property


module.exports = {
    priority: 1000,
    enabled: true,
    run: async function (app) {
        console.log(" -- support for subfolders in init directory");
    }
}

