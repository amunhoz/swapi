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
   //check headers_sent 
   if (ctx.res && ctx.res._headerSent && !returnResult) { 
    throw new Error('Headers already sended... cancelling blueprint operation'); //outside callback
    return;//if any other middleware has ended it
    }

    //----------------------------------------------------------------------------------------------------------
    //checking model
    let model = app.models[ctx.modelName];
    if (!model) {
        let resp = {error:{ code:"err_blueprint_model_nf", title: "Model not found!", details: {modelName:ctx.modelName}}}
        return ctx.res.status(500).send(resp) && false;
    }

    //----------------------------------------------------------------------------------------------------------
    //defining criteria
    var query = {};

    if (ctx.query) query = JSON.parse(JSON.stringify(ctx.query)) ; //clone object
    if (ctx.req.query) query = lib.blueHelper.mergeQuery (query, ctx.req.query)
    if (ctx.addFilter) query.where  = lib.blueHelper.AddAndFilter(query.where, ctx.addFilter);
        
    //----------------------------------------------------------------------------------------------------------
    //main command
    var result = await model.count(criteria,  { req: ctx.req, res: ctx.res });
    
    //----------------------------------------------------------------------------------------------------------
    //return results

    if (returnResult) return result
    else return ctx.res.send(result)
    
}


module.exports = func;
