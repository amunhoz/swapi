'use strict';

module.exports = {
	put: function (req, res) {
        global.lib.blueprints.update({ req: req, res: res, modelName: "User", fieldKey: "username" });
    },
	
	get: function (req, res) {
        global.lib.blueprints.update({ req: req, res: res, modelName: "User", fieldKey: "username" });
    },
	
	delete: function (req, res) {
        global.lib.blueprints.delete({ req: req, res: res, modelName: "User", fieldKey: "username" });
    }
	
};
