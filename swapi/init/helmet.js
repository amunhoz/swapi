
module.exports = {
  name: "helmet",
  run: async function (appExpress) {

		var helmet = require('helmet');
		appExpress.use(helmet());

    console.log("(init) Helmet security loaded");
	
  }
}
