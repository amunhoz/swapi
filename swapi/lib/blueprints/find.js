'use strict';

var find = async function (ctx) {
	//ctx = {modelName:modname , req: req, res: res,  addFilter: addFilter, sort: sort}

    let criteria = {};

    //filter
    if (ctx.req.query.filter) criteria.filter  = lib.blueHelper.CheckFilterJson(ctx.req.query.filter);
    else if (ctx.filter) criteria.filter  = ctx.filter;
    if (ctx.addFilter) {
        criteria.filter  = lib.blueHelper.AddAndFilter(criteria.filter, ctx.addFilter);
    }
    
    //limit for query
    if (ctx.req.query.limit) criteria.limit = ctx.req.query.limit;

    //skip
    if (ctx.req.query.skip) criteria.skip = ctx.req.query.skip;

    //sort
    if (ctx.req.query.sort) criteria.sort  = ctx.req.query.sort;
    else if (ctx.sort) criteria.sort  = ctx.sort;


    //getting model
    let model = swapi.imodels[ctx.modelName];
    if (!model) return ctx.res.status(500).send({"success":false, error: "Model not found! (" + ctx.modelName + ")" })

    	
    
    try {
        var result = await model.find(criteria, { req: ctx.req, res: ctx.res });
    }
    catch (e) {
        return ctx.res.status(500).send({"success":false, error: e });
    }

    ctx.res.send(result);

}


module.exports = find;
