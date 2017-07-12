'use strict';

var func = async function (ctx) {
	//ctx = {modelName:modname , req: req, res: res, filter: filter}
	
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) return ctx.res.status(500).send({ "success": false, error: "Model not found! (" + ctx.modelName + ")" })

    let primaryKey;
    if (ctx.fieldKey) primaryKey = ctx.fieldKey;
    else primaryKey = model.model.primaryKey;


    let filter = global.lib.blueHelper.getIdFilter(ctx.req, ctx.res, primaryKey);
    if (ctx.filter) {
        filter = global.lib.blueHelper.AddAndFilter(filter, ctx.filter);
    }

	try {
        var result = await model.delete(filter,  { req: ctx.req, res: ctx.res });
	}
	catch (e) {
        return ctx.res.status(500).send({"success":false, error: e })
	}
	
		
    ctx.res.send(result);
}


module.exports = func;
