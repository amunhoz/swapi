'use strict';
const ModelName = "pet";

module.exports = {
    get: async function (req, res) {
		let tag = req.query.tag;
        let tagReg = await swapi.models['tag'].find({ "name": tag });


		if (tagReg[0]) {
            let filter = { tag: tagReg[0].id };
			global.lib.blueprints.find({ req: req, res: res, modelName: ModelName, addFilter: filter });
        } else {
            return res.status(404).send({ "success": false, error: "Tag not found" });
        }
		
        
    }
};
