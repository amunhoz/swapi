'use strict';

var find = async function (ctx, returnResult) {
	//ctx = {modelName:modname , req: req, res: res,  addFilter: addFilter, sort: sort}
    var response = {};
    let criteria = {};

    //filter
    if (ctx.req.query.filter) criteria.filter  = lib.blueHelper.CheckFilterJson(ctx.req.query.filter);
    else if (ctx.filter) criteria.filter  = ctx.filter;
    if (ctx.addFilter) {
        criteria.filter  = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);
    }

    //limit for query
    if (ctx.req.query.limit) criteria.limit = ctx.req.query.limit;

    //skip
    if (ctx.req.query.skip) criteria.skip = ctx.req.query.skip;

    //sort
    if (ctx.req.query.sort) criteria.sort  = ctx.req.query.sort;
    else if (ctx.sort) criteria.sort  = ctx.sort;


    //getting model
    let model = swapi.imodels[ctx.modelName];
    if (!model) {
        response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }
    
    try {
        var result = await model.find(criteria, { req: ctx.req, res: ctx.res });
    }
    catch (e) {
        response = {code:500, result: {"success":false, error: e } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }
    
    if (ctx.subItens) {
        //getting model
        let smodel = swapi.imodels[ctx.subItens.modelName];
        if (!smodel) {
            response = {code:500, result: {"success":false, error: "Model for subitens not found! (" + ctx.subItens.modelName + ")" } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
        }

        let scriteria = {};
        let pprimaryKey = model.model.primaryKey;

        for(var i = 0; i < result.length;i++){
            scriteria[ctx.subItens.parentField] = result[i][pprimaryKey];
            try {
                var sresult = await model.find(criteria, { req: ctx.req, res: ctx.res });
            }
            catch (e) {
                response = {code:500, result: {"success":false, error: e } }
                if (returnResult) return response
                else return ctx.res.status(response.code).send(response.result)
            }
            result[i][ctx.subItens.itemName] = sresult;
        }
        
    }

    if (result[0]){
        if (returnResult) return result
        else return ctx.res.send(result)
    } else {
        response = {code:404, result: {"success":false, error: "Register not found" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }

}


module.exports = find;
