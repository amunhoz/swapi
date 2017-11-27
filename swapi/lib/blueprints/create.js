'use strict';

var func = async function (ctx, returnResult) {
    /*
    ctx = {
        modelName:modname,                  //model name for the operation
        req: req,                           // request object
        res: res,                           // response object
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
    
    //check headers_sent 
    if (ctx.res && ctx.res._headerSent && !returnResult) { 
        throw new Error('Headers already sended... cancelling blueprint operation'); //outside callback
        return;//if any other middleware has ended it
    }

    //----------------------------------------------------------------------------------------------------------
    //checking model
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) {
        let resp = {error:{ code:"err_blueprint_model_nf", title: "Model not found!", details: {modelName:ctx.modelName}}}
        return ctx.res.status(500).send(resp) && false;
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
    try{
        var result = await model.create(data, { req: ctx.req, res: ctx.res });
    }
    catch (e) {
        let resp = {error:{ code:"err_blueprint_create", title: "Erro ao criar o novo registro!", details: {data:data,message:e.message, stack:e.stack}}}
        return ctx.res.status(400).send(resp) && false;
    }

    //checking for event cancelation of the operation
    if (result === false) return false;
    
    
    //----------------------------------------------------------------------------------------------------------
    //suport for sub itens 
    if (ctx.subItens && result && dataItens[0]) {
        //getting model
        let smodel = swapi.imodels[ctx.subItens.modelName];
        if (!smodel) {
            let resp = {error:{ code:"err_blueprint_model_nf", title: "Model not found!", details: {modelName:ctx.subItens.modelName}}}
            return ctx.res.status(500).send(resp) && false;
        }

        let defaults = {};
        let pprimaryKey = model.model.primaryKey;
        
        result[ctx.subItens.itemName] = [];

        for(var i = 0; i < dataItens.length;i++){
            //feeding connection
            dataItens[i][ctx.subItens.parentField] = result[pprimaryKey];
            try {
                var sresult = await smodel.create(dataItens[i], { req: ctx.req, res: ctx.res });
            }
            catch (e) {
                let resp = {error:{ code:"err_blueprint_sub_create", title: "Erro ao criar o novo registro!", details: {data:dataItens[i],message:e.message, stack:e.stack}}}
                return ctx.res.status(400).send(resp) && false;
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
