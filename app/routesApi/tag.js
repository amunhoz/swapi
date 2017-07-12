'use strict';

module.exports = {
	post: async function (req, res) {
        global.lib.blueprints.create({ req: req, res: res, modelName: "tag" });
		// alternative
		//{ req: req, res: res, modelName: "Pet", defaults: {"field1": 0} }
    },
    get: async function (req, res) {
        global.lib.blueprints.find({ req: req, res: res, modelName: "tag" });
    }

};
