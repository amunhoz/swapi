'use strict';
const merge = require('merge');
var clone = require('util')._extend;

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

    //check headers_sent 
    if (ctx.res && ctx.res._headerSent && !returnResult) { 
        throw new Error('Headers already sended... cancelling blueprint operation'); //outside callback
        return;//if any other middleware has ended it
    }
    
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
    
    if (ctx.query) query = Object.assign({}, ctx.query); //clone object
    for (var ni in ctx.req.query) {
        if (typeof ctx.req.query[ni] != "undefined" && !ctx.req.query[ni]) 
            query[ni] = ctx.req.query[ni];
    }
    if (ctx.addFilter) query.where  = lib.blueHelper.AddAndFilter(query.where, ctx.addFilter);

    //----------------------------------------------------------------------------------------------------------
    //executing    
    var result = await model.find(query, { req: ctx.req, res: ctx.res });
    
    //checking for event cancelation of the operation
    if (result === false) return false;
    

    var resultFinal = [];   
    //----------------------------------------------------------------------------------------------------------
    //suport for sub itens 
    if (ctx.subItens && result[0]) {
        //checking model
        let smodel = swapi.imodels[ctx.subItens.modelName];
        if (!smodel) {
            let resp = {error:{ code:"err_blueprint_model_nf", title: "Model not found!", details: {modelName:ctx.subItens.modelName}}}
            return ctx.res.status(500).send(resp) && false;
        }
        
        let pprimaryKey = model.model.primaryKey;
        
        //getting subitens from each result
        for(var i = 0; i < result.length;i++){
            let squery = {};
            //query customization
            if (ctx.subItens.query) squery =  Object.assign({}, ctx.subItens.query)  //clone object
            if (!squery.where) squery.where = {};
            squery.where[ctx.subItens.parentField] = result[i][pprimaryKey];
            if (ctx.subItens.addFilter) squery.where  = lib.blueHelper.AddAndFilter(squery.where, ctx.subItens.addFilter);

            //execute query
            var sresult = await smodel.find(squery, { req: ctx.req, res: ctx.res });
            let record = result[i].toObject();
            record[ctx.subItens.itemName] = sresult
            //result[i][ctx.subItens.itemName] = sresult;
            resultFinal.push(record);
        }
    } else {
        resultFinal = result;
    }

    //----------------------------------------------------------------------------------------------------------
    //return results
    if (resultFinal[0]) {
        if (returnResult) return resultFinal
        else return ctx.res.send(resultFinal)
    } else {
        let resp = {error:{ code:"blueprint_reg_not_found", title: "Register not found!", details: {query: query}}}
        return ctx.res.status(404).send(resp) && false;
    }
}


module.exports = find;
