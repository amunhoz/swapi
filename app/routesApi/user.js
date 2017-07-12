'use strict';

module.exports = {
	post: function (req, res) {
        global.lib.blueprints.create({ req: req, res: res, modelName: "User" });
		// alternative
		//{ req: req, res: res, modelName: "Pet", defaults: {"field1": 0} }
    }
};
