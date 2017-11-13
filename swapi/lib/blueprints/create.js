'use strict';

var func = async function (ctx, returnResult) {
	//ctx = {modelName:modname , req: req, res: res, defaults: {field1:"lalal"} } 
    var response = {};
    //getting model
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) {
        response = {code:500, result: {"success":false, error: "Model not found! (" + ctx.modelName + ")" } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
    }
    
    let data = ctx.req.body;

    if (ctx.defaults) {
        for (item in ctx.defaults) {
            data[item] = ctx.defaults[item];
        }
    }
	
	try {
        var result = await model.create(data, { req: ctx.req, res: ctx.res });
	}
	catch (e) {
        response = {code:500, result: {"success":false, error: e } }
        if (returnResult) return response
        else return ctx.res.status(response.code).send(response.result)
	}
    if (returnResult) return result
    else return ctx.res.send(result)
    
}


module.exports = func;
