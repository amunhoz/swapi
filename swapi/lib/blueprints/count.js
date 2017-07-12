'use strict';

var func = async function (ctx) {
	//ctx = {modelName:modname , req: req, res: res, filter: filter}
	
    let filter = global.lib.blueHelper.CheckFilterJson(ctx.req.query.filter);
    if (ctx.filter) {
        filter = global.lib.blueHelper.AddAndFilter(filter, ctx.filter);
    }

    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) return ctx.res.status(500).send({ "success": false, error: "Model not found! (" + ctx.modelName + ")" })
	
	try {
        var result = await model.update(filter,  { req: ctx.req, res: ctx.res });
	}
	catch (e) {
        return ctx.res.status(500).send({"success":false, error: e })
	}

    ctx.res.send(result);
}


module.exports = func;
