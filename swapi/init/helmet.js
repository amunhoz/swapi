
module.exports = {
  name: "helmet",
  run: async function (app) {

		var helmet = require('helmet');
		app.use(helmet());

    console.log("(init) Helmet security loaded");
	
  }
}
