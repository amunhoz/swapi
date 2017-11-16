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
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) {
        response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }

    //----------------------------------------------------------------------------------------------------------
    //defining criteria
    let criteria = {};
    
    //primaryKey 
    let primaryKey;
    if (ctx.primaryKey) primaryKey = ctx.primaryKey;
    else primaryKey = model.model.primaryKey;
    
    //idParam from params req
    let idParam
    if (ctx.idParam) idParam = ctx.idParam;
    else idParam = "id";
    
    //filter
    criteria.filter = lib.blueHelper.getIdFilter(ctx.req, ctx.res, primaryKey, idParam);
    if (ctx.filter) criteria.filter  = ctx.filter;
    if (ctx.addFilter) criteria.filter  = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);

    
    //----------------------------------------------------------------------------------------------------------
    //getting data
    let data = ctx.req.body;

    if (ctx.defaults) {
        for (item in ctx.defaults) {
            data[item] = ctx.defaults[item];
        }
    }
    
    //----------------------------------------------------------------------------------------------------------
    //suport for sub itens 
    var dataItens = [];
    if (ctx.subItens) {
        if (data[ctx.subItens.itemName]) {
            dataItens = data[ctx.subItens.itemName];
            delete data[ctx.subItens.itemName];
        }
    }

    //----------------------------------------------------------------------------------------------------------
    // loop every item and check for update or create
    try {
        var result = await model.update(criteria, data, { req: ctx.req, res: ctx.res });
    }
    catch (e) {
        if (!model) {
            response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
        }
    }

    //----------------------------------------------------------------------------------------------------------
    //deal with subitens
    if (ctx.subItens && result[0] && dataItens[0]) {
        //getting model
        let smodel = swapi.imodels[ctx.subItens.modelName];
        if (!smodel) {
            response = {code:500, result: {"success":false, error: "Model for subitens not found! (" + ctx.subItens.modelName + ")" } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
        }

        let pprimaryKey = model.model.primaryKey;
        let sprimaryKey = ctx.subItens.primaryKey;
        result[0][ctx.subItens.itemName] = [];
        var sresult;
        var currentItens = [];
        let scriteria = {};

        //==============================================================================================
        // loop every item and check for update or create
        for(var i = 0; i < dataItens.length;i++){
            //default value
            dataItens[i][ctx.subItens.parentField] = result[pprimaryKey]

            try {
                if (dataItens[i][sprimaryKey] && dataItens[i][sprimaryKey] > 0 ) {
                    //update                   
                    let itemId = dataItens[i][ctx.subItens.primaryKey]; 
                    scriteria[sprimaryKey] = itemId;
                    sresult = await model.update(scriteria, dataItens[i], { req: ctx.req, res: ctx.res });
                    if (sresult[0]) result[0][ctx.subItens.itemName].push(sresult[0]);
                    currentItens.push(itemId);

                } else {
                    //create
                    sresult = await model.create(dataItens[i], { req: ctx.req, res: ctx.res });
                    result[0][ctx.subItens.itemName].push(sresult);
                    currentItens.push(sresult[sprimaryKey]);
                }
                
            }
            catch (e) {
                response = {code:500, result: {"success":false, error: JSON.stringify(e) } }
                if (returnResult) return response
                else return ctx.res.status(response.code).send(response.result)
            }
            
        } // end for

        
        //==============================================================================================
        //delete all except the current itens
        scriteria[sprimaryKey] = {$nin : currentItens}
        try {
            var result = await model.delete(scriteria,  { req: ctx.req, res: ctx.res });
        }
        catch (e) {
            if (!model) {
                response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
                if (returnResult) return response
                else return ctx.res.status(response.code).send(response.result)
            }
        }
        
    }

    //----------------------------------------------------------------------------------------------------------
    //return results
    if (result[0]) {
        if (returnResult) return result[0]
        else return ctx.res.send(result[0])
    }
    else {
        response = {code:404, result: {"success":false, error: "Register not found" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }
    
}

module.exports = func;

