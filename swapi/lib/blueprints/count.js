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
        let resp = {error:{ code:"err_blueprint_model_nf", title: "Model not found!", details: {modelName:ctx.modelName}}}
        return ctx.res.status(500).send(resp) && false;
    }

    
   //----------------------------------------------------------------------------------------------------------
    //defining criteria
    var query = {};
    if (ctx.query) query =  Object.assign({}, ctx.query)  //clone object

    for (var ni in ctx.req.query) {
        if (typeof ctx.req.query[ni] != "undefined" && !ctx.req.query[ni]) 
            query[ni] = ctx.req.query[ni];
    }
    if (ctx.addFilter) query.where  = lib.blueHelper.AddAndFilter(query.where, ctx.addFilter)
    
    //----------------------------------------------------------------------------------------------------------
    //main command

    var result = await model.count(criteria,  { req: ctx.req, res: ctx.res });
    
    //----------------------------------------------------------------------------------------------------------
    //return results

    if (returnResult) return result
    else return ctx.res.send(result)
    
}


module.exports = func;
