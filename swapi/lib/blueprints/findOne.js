'use strict';

var findOne = async function (ctx, returnResult) {

    /*
    ctx = {
        modelName:modname,                  //model name for the operation
        req: req,                           // request object
        res: res,                           // response object
        addFilter: addFilter,               // additional filter
        query: {                            // will replace parameters in query (sort, limit, skip, filter)
            filter: {field: "value"},        //replace the filter
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
        response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
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


    var filter = {};
    //get criteria
    filter = lib.blueHelper.getIdFilter(ctx.req, ctx.res, primaryKey, idParam);

    //filter
    if (ctx.query.filter) filter  = ctx.query.filter;
    if (ctx.addFilter) filter  = lib.blueHelper.AddAndFilter(filter, ctx.addFilter);

    ctx.filter = filter;

    //----------------------------------------------------------------------------------------------------------
    //use other blueprint to main command
    var response = await lib.blueprints.find(ctx, true);

    //----------------------------------------------------------------------------------------------------------
    //return results
    if (returnResult) {
        return response;
    } else {
        if (response.code) {
            ctx.res.status(response.code).send(response.result)
        } else {
            ctx.res.send(response[0]);
        }
    }
    
}


module.exports = findOne;

