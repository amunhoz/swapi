﻿
module.exports = {
  name: "events",
  run: async function (appExpress) {
	  
	  // Create an eventEmitter object
		var EventEmitter2 = require('eventemitter2').EventEmitter2;
		swapi.events = new EventEmitter2({
				wildcard: true,
				delimiter: '.', 
				maxListeners: 20,
				verboseMemoryLeak: false
		});

    console.log("(init) Events module loaded");  

  }
}

