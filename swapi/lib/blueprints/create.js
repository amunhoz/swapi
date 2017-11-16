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
    
    var response = {};
    //----------------------------------------------------------------------------------------------------------
    //checking model
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) {
        response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }
    
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
    //execute main command
	try {
        var result = await model.create(data, { req: ctx.req, res: ctx.res });
	}
	catch (e) {
        response = {code:500, result: {"success":false, error: JSON.stringify(e) } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }
    
    //----------------------------------------------------------------------------------------------------------
    //suport for sub itens 
    if (ctx.subItens && result && dataItens[0]) {
        //getting model
        let smodel = swapi.imodels[ctx.subItens.modelName];
        if (!smodel) {
            response = {code:500, result: {"success":false, error: "Model for subitens not found! (" + ctx.subItens.modelName + ")" } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
        }

        let defaults = {};
        let pprimaryKey = model.model.primaryKey;
        defaults[ctx.subItens.parentField] = result[pprimaryKey];
        result[ctx.subItens.itemName] = [];

        for(var i = 0; i < dataItens.length;i++){
            try {
                var sresult = await model.create(dataItens[i], { req: ctx.req, res: ctx.res });
            }
            catch (e) {
                response = {code:500, result: {"success":false, error: JSON.stringify(e) } }
                if (returnResult) return response
                else return ctx.res.status(response.code).send(response.result)
            }
            result[ctx.subItens.itemName].push(sresult);
        }
        
    }

    //----------------------------------------------------------------------------------------------------------
    //return results
    if (returnResult) return result
    else return ctx.res.send(result)
    
}


module.exports = func;
