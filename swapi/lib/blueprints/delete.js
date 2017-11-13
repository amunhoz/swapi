'use strict';

var func = async function (ctx, returnResult) {
	//ctx = {modelName:modname , req: req, res: res, filter: filter}
	
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) {
        response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }

    //primaryKey 
    let primaryKey;
    if (ctx.primaryKey) primaryKey = ctx.primaryKey;
    else primaryKey = model.model.primaryKey;
    
    //idParam from params req
    let idParam
    if (ctx.idParam) idParam = ctx.idParam;
    else idParam = "id";
    
    let criteria = {}
    //filter
    criteria.filter = lib.blueHelper.getIdFilter(ctx.req, ctx.res, primaryKey, idParam);
    if (ctx.filter) criteria.filter  = ctx.filter;
    if (ctx.addFilter) criteria.filter  = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);
    

	try {
        var result = await model.delete(criteria.filter,  { req: ctx.req, res: ctx.res });
	}
	catch (e) {
        if (!model) {
            response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
        }
    }
    
    if (result[0]) {
        if (returnResult) return result[0]
        else return ctx.res.send(result[0])
    } else {
        response = {code:404, result: {"success":false, error: "Register not found" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }
}


module.exports = func;
