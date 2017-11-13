'use strict';

var func = async function (ctx, returnResult) {
	//ctx = {modelName:modname , req: req, res: res, filter: filter}
	
    let filter = global.lib.blueHelper.CheckFilterJson(ctx.req.query.filter);
    if (ctx.filter) {
        filter = global.lib.blueHelper.AddAndFilter(filter, ctx.filter);
    }

    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) {
        response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }
	
	try {
        var result = await model.count(filter,  { req: ctx.req, res: ctx.res });
	}
	catch (e) {
        if (!model) {
            response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
        }
	}
    if (returnResult) return result
    else return ctx.res.send(result)
    
}


module.exports = func;
