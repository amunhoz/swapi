
module.exports = {
  name: "express-basic",
  run: async function (app) {
	  
    var bodyParser = require('body-parser')
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	
	var compression = require('compression');
	app.use(compression())
	
	var cookieParser = require('cookie-parser');
	app.use(cookieParser());
	
	var cookieSession = require('cookie-session');
		app.use(cookieSession({
		name: 'session',
		keys: ['lalala', 'bububububububub']
	}));
	
	var session = require('express-session');
	app.use(session({
	  secret: 'keyboard categorie lalala',
	  resave: false,
	  saveUninitialized: true,
	  cookie: { secure: true }
	}))

    console.log("(init) Express basic config loaded");
  }
}
