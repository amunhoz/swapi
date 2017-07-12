'use strict';

module.exports = {
	put: function (req, res) {
        lib.blueprints.update({ req: req, res: res, modelName: "Tag"});
    },
	
    get: async function (req, res) {
        try {
            await lib.blueprints.findOne({ req: req, res: res, modelName: "Tag" });
        } catch (e) {
            return ctx.res.status(500).send({ "success": false, error: e });
        }
        
    },
	
	delete: function (req, res) {
        lib.blueprints.delete({ req: req, res: res, modelName: "Tag" });
    }
	
};
