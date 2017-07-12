'use strict';

var func = async function (ctx) {
    //ctx = {modelName:modname , req: req, res: res, addFilter: filter , defaults: {field1:"lalal"}, fieldKey: "id" }

    //getting model
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) return ctx.res.status(500).send({ "success": false, error: "Model not found! (" + ctx.modelName + ")" })


    let criteria = {};
    let primaryKey;
    if (ctx.fieldKey) primaryKey = ctx.fieldKey;
    else primaryKey = model.model.primaryKey;

    //filter
    criteria.filter = lib.blueHelper.getIdFilter(ctx.req, ctx.res, primaryKey);
    if (ctx.addFilter) {
        criteria.filter = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);
    }

    


    let data = ctx.req.body;

    if (ctx.defaults) {
        for (item in ctx.defaults) {
            data[item] = ctx.defaults[item];
        }
    }
    
    try {
        var result = await model.update(criteria, data, { req: ctx.req, res: ctx.res });
    }
    catch (e) {
        return ctx.res.status(500).send({"success":false, error: e });
    }

    ctx.res.send(result);
    
}

module.exports = func;

