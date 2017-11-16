'use strict';

var find = async function (ctx, returnResult) {
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
        }
    }
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
    else query = ctx.req.query;
    
    //filter
    if (query.filter) criteria.filter  = lib.blueHelper.CheckFilterJson(query.filter);    
    if (ctx.addFilter) criteria.filter  = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);

    //limit for query
    if (query.limit) criteria.limit = query.limit;

    //skip
    if (query.skip) criteria.skip = query.skip;

    //sort
    if (query.sort) criteria.sort  = query.sort;
    else if (ctx.sort) criteria.sort  = ctx.sort;


    //----------------------------------------------------------------------------------------------------------
    //executing    
    try {
        var result = await model.find(criteria, { req: ctx.req, res: ctx.res });
    }
    catch (e) {
        response = {code:500, result: {"success":false, error: JSON.stringify(e) } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }
    
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
        let pprimaryKey = model.model.primaryKey;
        //getting subitens from each result
        for(var i = 0; i < result.length;i++){
            scriteria[ctx.subItens.parentField] = result[i][pprimaryKey];
            try {
                var sresult = await model.find(criteria, { req: ctx.req, res: ctx.res });
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
