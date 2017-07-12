'use strict';

var findOne = async function (ctx) {
	//ctx = {modelName:modname , req: req, res: res, addFilter: filter , fieldKey: "id"}
    let criteria = {};
    criteria.filter  = {};

    //getting model
    let model = swapi.imodels[ctx.modelName.toLowerCase()];
    if (!model) return ctx.res.status(500).send({ "success": false, error: "Model not found! (" + ctx.modelName + ")" })

    let primaryKey;
    if (ctx.fieldKey) primaryKey = ctx.fieldKey;
    else primaryKey = model.model.primaryKey;

    //filter
    criteria.filter = lib.blueHelper.getIdFilter(ctx.req, ctx.res, primaryKey);
    if (ctx.addFilter) {
        filter = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);
    }

    try {
        var result = await model.find(criteria, { req: ctx.req, res: ctx.res });
    }
    catch (e) {
        return ctx.res.status(500).send({"success":false, error: e });
    }

    if (result[0]) return ctx.res.send(result[0]);
    else return ctx.res.send({});

}


module.exports = findOne;

