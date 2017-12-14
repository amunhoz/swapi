//This file will be executed every time the system boot
//it will follow the order defined in 'priority' property


module.exports = {
    priority: 999,
    enabled: true,
    run: async function (appExpress) {

		console.log(" -- (api mid) loaded your mid");
     
    }
}