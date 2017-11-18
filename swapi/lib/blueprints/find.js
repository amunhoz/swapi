'use strict';
const merge = require('merge');
var find = async function (ctx, returnResult) {
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
        },
        subItens:{
            modelName : "model_itens", //model name for subitens
            parentField : "model_id",  // parent id field name
            itemName : "itens",            // name for the itens in the data array
            primaryKey: "id"
        }
    }
    It auto check query parameters:
        filter - filter in json format (see waterline doc)
        pupulate - the presence of the parameter will trigger the populate of relations
    */
    var response = {};
    let criteria = {};

    //----------------------------------------------------------------------------------------------------------
    //checking model
    let model = swapi.imodels[ctx.modelName];
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
    if (ctx.addFilter) query.where  = lib.blueHelper.AddAndFilter(query.where, ctx.addFilter);

    //----------------------------------------------------------------------------------------------------------
    //executing    
    var result = await model.find(query, { req: ctx.req, res: ctx.res });
       
    //----------------------------------------------------------------------------------------------------------
    //suport for sub itens 
    if (ctx.subItens && result[0]) {
        //checking model
        let smodel = swapi.imodels[ctx.subItens.modelName];
        if (!smodel) {
            response = {code:500, result: {"success":false, error: "Model for subitens not found! (" + ctx.subItens.modelName + ")" } }
            if (returnResult) return response
            else return ctx.res.status(response.code).send(response.result)
        }

        let scriteria = {};
        scriteria.where = {};
        let pprimaryKey = model.model.primaryKey;
        //getting subitens from each result
        for(var i = 0; i < result.length;i++){
            scriteria.where[ctx.subItens.parentField] = result[i][pprimaryKey];
            try {
                var sresult = await smodel.find(scriteria, { req: ctx.req, res: ctx.res });
            }
            catch (e) {
                response = {code:500, result: {"success":false, error: JSON.stringify(e) } }
                if (returnResult) return response
                else return ctx.res.status(response.code).send(response.result)
            }
            result[i][ctx.subItens.itemName] = sresult;
        }
        
    }

    //----------------------------------------------------------------------------------------------------------
    //return results
    if (result[0]){
        if (returnResult) return result
        else return ctx.res.send(result)
    } else {
        response = {code:404, result: {"success":false, error: "Register not found" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }

}


module.exports = find;
