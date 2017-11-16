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
        },
        subItens:{
            modelName : "model_itens", //model name for subitens
            parentField : "model_id",  // parent id field name
            itemName : "itens",            // name for the itens in the data array
            primaryKey: "id"
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

    //primaryKey 
    let primaryKey;
    if (ctx.primaryKey) primaryKey = ctx.primaryKey;
    else primaryKey = model.model.primaryKey;
    
    //idParam from params req
    let idParam
    if (ctx.idParam) idParam = ctx.idParam;
    else idParam = "id";
    
    let criteria = {}

    //get filter from res
    criteria.filter = lib.blueHelper.getIdFilter(ctx.req, ctx.res, primaryKey, idParam);
    if (ctx.filter) criteria.filter  = ctx.filter;
    if (ctx.addFilter) criteria.filter  = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);
    

    //----------------------------------------------------------------------------------------------------------
    //execute
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
    
    //----------------------------------------------------------------------------------------------------------
    //suport for sub itens 
    if (ctx.subItens && result[0]) {
        //getting model
        let smodel = swapi.imodels[ctx.subItens.modelName];
        if (!smodel) {
            response = {code:500, result: {"success":false, error: "Model for subitens not found! (" + ctx.subItens.modelName + ")" } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
        }

        let scriteria = {};
        let pprimaryKey = model.model.primaryKey;
        scriteria[ctx.subItens.parentField] = result[0][pprimaryKey];
        
        // delete at once
        try {
            var sresult = await model.delete(scriteria, { req: ctx.req, res: ctx.res });
        }
        catch (e) {
            response = {code:500, result: {"success":false, error: JSON.stringify(e) } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
        }
        result[0][ctx.subItens.itemName] = sresult;
        
    }

    //----------------------------------------------------------------------------------------------------------
    //return results
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
