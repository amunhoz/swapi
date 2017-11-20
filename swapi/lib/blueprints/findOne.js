'use strict';

var findOne = async function (ctx, returnResult) {

    /*
    ctx = {
        modelName:modname,                  //model name for the operation
        req: req,                           // request object
        res: res,                           // response object
        addFilter: addFilter,               // additional filter
        query: {                            // will replace parameters in query (sort, limit, skip, filter)
            where: {field: "value"},        //replace the filter
        },
        subItens:{
            modelName : "model_itens", //model name for subitens
            parentField : "model_id",  // parent id field name
            itemName : "itens",            // name for the itens in the data array
            primaryKey: "id"
        },
        defaults: {
            field1: "value",
            field2: "value"
        }
    }
    */

    //----------------------------------------------------------------------------------------------------------
    //checking model
    let model = swapi.imodels[ctx.modelName];
    if (!model) {
        let resp = {error:{ code:"err_blueprint_model_nf", title: "Model not found!", details: {modelName:ctx.modelName}}}
        return ctx.res.status(500).send(resp) && false;
    }

    
    //----------------------------------------------------------------------------------------------------------
    //Get filter

    //primaryKey 
    let primaryKey;
    if (ctx.primaryKey) primaryKey = ctx.primaryKey;
    else primaryKey = model.model.primaryKey;

    //id field param
    let idParam
    if (ctx.idParam) idParam = ctx.idParam;
    else idParam = "id";

   //----------------------------------------------------------------------------------------------------------
    //defining where clause
    let query = {}
    if (ctx.query) query = ctx.query;
    //get filter from res
    if (!query.where) query.where = lib.blueHelper.getIdFilter(ctx.req, ctx.res, primaryKey, idParam);
    if (ctx.query && ctx.query.where) query.where = lib.blueHelper.mergeQuery(query.where, ctx.query.where);
    if (ctx.addFilter) query.where  = lib.blueHelper.AddAndFilter(query.where, ctx.addFilter)
    ctx.query = query;

    //----------------------------------------------------------------------------------------------------------
    //use other blueprint to main command
    var resp = await lib.blueprints.find(ctx, true);
    
    // return results - if false, probaly the res.send was runned
    if (resp !== false){
        if (returnResult) {
            return resp[0];
        } else {
            ctx.res.send(resp[0]);
        }
    } 

    
    
}


module.exports = findOne;

