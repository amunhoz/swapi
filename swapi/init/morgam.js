//access log

module.exports = {
  name: "morgan",
  run: async function (app) {
	var fs = require("fs");
	var morgan = require('morgan');
	const accessLogStream = fs.createWriteStream(__dirname + '/../../data/access.log',
                                             { flags: 'a' })
	  
    app.use(morgan('combined', { stream: accessLogStream }))
    console.log("(init) Morgan log loaded");

	
  }
}
