'use strict';

var func = async function (ctx, returnResult) {
	/*
    ctx = {
        modelName:modname,                  //model name for the operation
        req: req,                           // request object
        res: res,                           // response object
        addFilter: addFilter,               // additional filter
        query: {                            // will replace parameters in query (sort, limit, skip, filter)
            where: {field: "value"},        //replace the filter
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
    if (ctx.req.query) query = lib.blueHelper.mergeQuery(query, ctx.req.query); //safe merger
    if (ctx.addFilter) query.where  = lib.blueHelper.AddAndFilter(query.where, ctx.addFilter)
    
    //----------------------------------------------------------------------------------------------------------
    //main command

	try {
        var result = await model.count(criteria,  { req: ctx.req, res: ctx.res });
	}
	catch (e) {
        throw Error(e);
        return;
    }
    
    //----------------------------------------------------------------------------------------------------------
    //return results

    if (returnResult) return result
    else return ctx.res.send(result)
    
}


module.exports = func;
