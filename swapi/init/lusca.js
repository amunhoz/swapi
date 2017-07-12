
module.exports = {
  name: "lusca",
  run: async function (app) {
	var lusca = require('lusca');
	app.use(lusca({
		csrf: true,
		csp: { /* ... */},
		xframe: 'SAMEORIGIN',
		p3p: 'ABCDEF',
		hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
		xssProtection: true,
		nosniff: true
	}));
    console.log("(init) Lusca security loaded");
	
  }
}
