'use strict';

var func = async function (ctx) {
	//ctx = {modelName:modname , req: req, res: res, defaults: {field1:"lalal"} } 

    //getting model
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) return ctx.res.status(500).send({ "success": false, error: "Model not found! (" + ctx.modelName + ")" })
    
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
        return ctx.res.status(500).send({"success":false, error: e })
	}

    ctx.res.send(result);
}


module.exports = func;
