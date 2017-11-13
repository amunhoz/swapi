'use strict';

var func = async function (ctx, returnResult) {
	//ctx = {modelName:modname , req: req, res: res, filter: filter}

    //----------------------------------------------------------------------------------------------------------
    //checking model
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) {
        response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }

    //----------------------------------------------------------------------------------------------------------
    //defining criteria

    //filter
    if (ctx.req.query.filter) criteria.filter  = lib.blueHelper.CheckFilterJson(ctx.req.query.filter);
    else if (ctx.filter) criteria.filter  = ctx.filter;
    if (ctx.addFilter) {
        criteria.filter  = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);
    }
    
    //----------------------------------------------------------------------------------------------------------
    //main command

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
    
    //----------------------------------------------------------------------------------------------------------
    //return results

    if (returnResult) return result
    else return ctx.res.send(result)
    
}


module.exports = func;
