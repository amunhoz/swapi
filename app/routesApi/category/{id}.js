'use strict';

module.exports = {
	put: function (req, res) {
        lib.blueprints.update({ req: req, res: res, modelName: "category"});
    },
	
	get: function (req, res) {
        lib.blueprints.findOne({ req: req, res: res, modelName: "category" });
    },
	
    delete: function (req, res) {
        lib.blueprints.delete({ req: req, res: res, modelName: "category" });
    }
	
};
