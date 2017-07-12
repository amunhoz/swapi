﻿//class to make crud operations with events support
function iModel(modelName) {
    this.modelName = modelName
    if (!swapi.models[this.modelName]) throw Error("Model not found! (" + modelName + ")");
    this.model = swapi.models[this.modelName];

}

//==========================================================================================
//FIND
iModel.prototype.find = async function (criteria, ctx) {
    //criteria {filter: {}, sort:"", limit:1, skip:10}
    if (!criteria.filter) criteria.filter = {};

    //emitting event BEFORE
    if (global.events) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "find", { model: this.model, criteria: criteria, ctx: ctx });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    try {
        var query = this.model.find(criteria.filter);
        if (criteria.sort) query.sort(criteria.sort);
        if (criteria.limit) query.limit(criteria.limit);
        if (criteria.skip) query.skip(criteria.skip);
        var result = await promisefyQueryExec(query);
        
    }
    catch (e) {
        throw Error(e);
    }
    //emitting event AFTER
    if (global.events) {
        global.lib.blueHelper.emitEvent(ctx.modelName, "after", "find", { model: this.model, criteria: criteria, ctx: ctx, result: result });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    return result;
}

//==========================================================================================
//COUNT

iModel.prototype.count = async function (criteria, ctx) {
    //criteria {filter: {}, sort:"", limit:1}
    if (!criteria.filter) criteria.filter = {};

    //emitting event BEFORE
    if (global.events) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "find", { model: this.model, criteria: criteria, ctx: ctx });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    try {
        var result = await this.model.count(criteria.filter);
    }
    catch (e) {
        throw Error(e);
    }
    //emitting event AFTER
    if (global.events) {
        global.lib.blueHelper.emitEvent(ctx.modelName, "after", "find", { model: this.model, criteria: criteria, ctx: ctx, result: result });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    return result;

}

//==========================================================================================
//FINDONE

iModel.prototype.findOne = async function (id, ctx) {

    let criteria = {};
    criteria.filter = {};
    criteria.filter[this.model.primaryKey] = id;

    //emitting event BEFORE
    if (global.events) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "find", { model: this.model, criteria: criteria, ctx: ctx });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    try {
        var query = this.model.find(criteria.filter);
        var result = await promisefyQueryExec(query);

    }
    catch (e) {
        throw Error(e);
    }
    //emitting event AFTER
    if (global.events) {
        global.lib.blueHelper.emitEvent(ctx.modelName, "after", "find", { model: this.model, criteria: criteria, ctx: ctx, result: result });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }
    if (result && result[0]) return result[0];
    else return result;
}

//==========================================================================================
//UPDATE

iModel.prototype.update = async function (idOrCriteria, data, ctx) {

    let criteria = {};
    if ((!!idOrCriteria) && (idOrCriteria.constructor === Object)) {
        criteria.filter = idOrCriteria.filter;
    } else {
        criteria.filter = {};
        criteria.filter[this.model.primaryKey] = idOrCriteria;
    }

    //emitting event BEFORE
    if (global.events) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "update", { model: this.model, criteria: criteria, ctx: ctx, data: data });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    try {
        var result = await this.model.update(criteria.filter, data);
    }
    catch (e) {
        throw Error(e);
    }
    //emitting event AFTER
    if (global.events) {
        global.lib.blueHelper.emitEvent(this.modelName, "after", "update", { model: this.model, criteria: criteria, ctx: ctx, data: data, result: result });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    return result;
}

//==========================================================================================
//CREATE

iModel.prototype.create = async function (data, ctx) {

    
    //emitting event BEFORE
    if (global.events) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "create", { model: this.model, ctx: ctx, data: data });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    try {
        var result = await this.model.create(data);
    }
    catch (e) {
        throw Error(e);
    }
    //emitting event AFTER
    if (global.events) {
        global.lib.blueHelper.emitEvent(this.modelName, "after", "create", { model: this.model, ctx: ctx, data: data, result: result });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    return result;


}
//==========================================================================================
//DELETE

iModel.prototype.delete = async function (idOrCriteria, ctx) {

    
    let criteria = {};
    if ((!!idOrCriteria) && (idOrCriteria.constructor === Object)) {
        criteria.filter = idOrCriteria;
    } else {
        criteria.filter = {};
        criteria.filter[this.model.primaryKey] = idOrCriteria;
    }

    //emitting event BEFORE
    if (global.events) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "delete", { model: this.model, criteria: criteria, ctx: ctx });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }

    try {
        var result = await this.model.destroy(criteria.filter);
    }
    catch (e) {
        throw Error(e);
    }

    //emitting event AFTER
    if (global.events) {
        global.lib.blueHelper.emitEvent(this.modelName, "after", "delete", { model: this.model, criteria: criteria, ctx: ctx, result: result });
        if (ctx.res._headerSent) return;//if any other middleware has ended it
    }
    return result;

}

async function promisefyQueryExec(query) {

    var prom = new Promise((resolve, reject) => {
        //inside code
        query.exec(function (err, result) {
            if (err) reject(err);
            else {
                resolve(result)
            }
        });
        //------------
    });

    return await prom;

}


module.exports = iModel;