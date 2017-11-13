'use strict';

var findOne = async function (ctx, returnResult) {
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

    //get criteria
    ctx.filter = lib.blueHelper.getIdFilter(ctx.req, ctx.res, primaryKey, idParam);


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

