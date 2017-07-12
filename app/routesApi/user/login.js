'use strict';

module.exports = {
	get: function (req, res) {
		res.status(200).send({"api_key":"123"});
    }	
};
