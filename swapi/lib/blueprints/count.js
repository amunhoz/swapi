'use strict';

var func = async function (ctx, returnResult) {
	/*
    ctx = {
        modelName:modname,                  //model name for the operation
        req: req,                           // request object
        res: res,                           // response object
        addFilter: addFilter,               // additional filter
        query: {                            // will replace parameters in query (sort, limit, skip, filter)
            filter: {field: "value"},        //replace the filter
            sort: sort,                     // Field ASC, reorder
            limit: limit,                   // limit itens
            skip: skip                      // skip itens
        }
    }
    */

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
    var query = {};
    if (ctx.query) query = ctx.query;
    else query = ctx.req.query;
    
    //filter
    if (query.filter) criteria.filter  = lib.blueHelper.CheckFilterJson(query.filter);    
    if (ctx.addFilter) criteria.filter  = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);

    //limit for query
    if (query.limit) criteria.limit = query.limit;

    //skip
    if (query.skip) criteria.skip = query.skip;

    //sort
    if (query.sort) criteria.sort  = query.sort;
    else if (ctx.sort) criteria.sort  = ctx.sort;

    
    //----------------------------------------------------------------------------------------------------------
    //main command

	try {
        var result = await model.count(criteria,  { req: ctx.req, res: ctx.res });
	}
	catch (e) {
            response = {code:500, result: {"success":false, error: JSON.stringify(e) } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
    }
    
    //----------------------------------------------------------------------------------------------------------
    //return results

    if (returnResult) return result
    else return ctx.res.send(result)
    
}


module.exports = func;
