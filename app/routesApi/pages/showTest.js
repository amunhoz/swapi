'use strict';

module.exports = {
	get: async function (req, res) {
        
		res.render(
		"testView",
		{message: "Olá test123"}
		);
		
    }
};
