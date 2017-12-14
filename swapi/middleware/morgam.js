//access log

module.exports = {
  name: "morgan",
  run: async function (appExpress) {
	var fs = require("fs");
	var morgan = require('morgan');
	const accessLogStream = fs.createWriteStream(__dirname + '/../../data/access.log',
                                             { flags: 'a' })
	  
    appExpress.use(morgan('combined', { stream: accessLogStream }))

	
  }
}
