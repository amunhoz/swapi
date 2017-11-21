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
            populate: 'item1, item2',       // populate relations
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
    
    let criteria = {};

    //----------------------------------------------------------------------------------------------------------
    //checking model
    let model = swapi.imodels[ctx.modelName];
    if (!model) {
        let resp = {error:{ code:"err_blueprint_model_nf", title: "Model not found!", details: {modelName:ctx.modelName}}}
        return ctx.res.status(500).send(resp) && false;
    }

    //----------------------------------------------------------------------------------------------------------
    //defining criteria
    var query = {};
    if (ctx.query) query = ctx.query;
    for (var ni in ctx.req.query) {
        if (typeof ctx.req.query[ni] != "undefined") 
            query[ni] = ctx.req.query[ni];
    }
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
            let resp = {error:{ code:"err_blueprint_model_nf", title: "Model not found!", details: {modelName:ctx.subItens.modelName}}}
            return ctx.res.status(500).send(resp) && false;
        }

        var squery = {};
        
        let scriteria = {};
        scriteria.where = {};
        let pprimaryKey = model.model.primaryKey;
        
        //getting subitens from each result
        for(var i = 0; i < result.length;i++){
            //query customization
            if (ctx.subItens.query) squery = ctx.subItens.query;
            squery.where[ctx.subItens.parentField] = squery[i][pprimaryKey];
            if (ctx.subItens.addFilter) squery.where  = lib.blueHelper.AddAndFilter(squery.where, ctx.subItens.addFilter);

            //execute query
            var sresult = await smodel.find(squery, { req: ctx.req, res: ctx.res });
            result[i][ctx.subItens.itemName] = sresult;
        }
        
    }

    //----------------------------------------------------------------------------------------------------------
    //return results
    
    if (result[0]) {
        if (returnResult) return result
        else return ctx.res.send(result)
    } else {
        let resp = {error:{ code:"blueprint_reg_not_found", title: "Register not found!", details: {query: query}}}
        return ctx.res.status(404).send(resp) && false;
    }
}


module.exports = find;
