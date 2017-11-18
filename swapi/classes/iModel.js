﻿//class to make crud operations with events support
function iModel(modelName, useEvents) {
    this.modelName = modelName
    if (!useEvents) useEvents = true;
    
    this.useEvents = useEvents;

    if (!swapi.models[this.modelName]) throw Error("Model not found! (" + modelName + ")");
    this.model = swapi.models[this.modelName];

}

//==========================================================================================
//FIND
iModel.prototype.find = async function (criteria, ctx) {
    //criteria {filter: {}, sort:"", limit:1, skip:10}
    
    if(!ctx) ctx = {};
    //emitting event BEFORE
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "find", { model: this.model, criteria: criteria, ctx: ctx });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }

    
    var query = this.model.find(criteria);
    if (criteria.populate) {
        if (Array.isArray(criteria.populate)) {
            //populate an array of modelnames
            criteria.populate.map(function (element) {
                query.populate(element)
                });
        } 
            // populate all
        else if (criteria.populate.toLowerCase() == "all")  query.populateAll();
            // populate only one model
        else  query.populate(criteria.populate);
        delete criteria.populate;
    }
    
    var result = await promisefyQueryExec(query);

    //emitting event AFTER
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(ctx.modelName, "after", "find", { model: this.model, criteria: criteria, ctx: ctx, result: result });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }

    return result;
}

//==========================================================================================
//COUNT

iModel.prototype.count = async function (criteria, ctx) {
    if(!ctx) ctx = {};

    //emitting event BEFORE
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "find", { model: this.model, criteria: criteria, ctx: ctx });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }

    var result = await this.model.count(criteria);

    //emitting event AFTER
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(ctx.modelName, "after", "find", { model: this.model, criteria: criteria, ctx: ctx, result: result });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }

    return result;

}

//==========================================================================================
//FINDONE

iModel.prototype.findOne = async function (idOrCriteria, ctx) {

    if(!ctx) ctx = {};
    let criteria = {};
    if ((!!idOrCriteria) && (idOrCriteria.constructor === Object)) {
        criteria = idOrCriteria;
    } else {
        criteria[this.model.primaryKey] = idOrCriteria;
    }

    //emitting event BEFORE
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "find", { model: this.model, criteria: criteria, ctx: ctx });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }


    var query = this.model.find(criteria);
    var result = await promisefyQueryExec(query);

    //emitting event AFTER
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(ctx.modelName, "after", "find", { model: this.model, criteria: criteria, ctx: ctx, result: result });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }
    if (result && result[0]) return result[0];
    else return result;
}

//==========================================================================================
//UPDATE

iModel.prototype.update = async function (idOrCriteria, data, ctx) {
    if(!ctx) ctx = {};
    let criteria = {};
    if ((!!idOrCriteria) && (idOrCriteria.constructor === Object)) {
        criteria = idOrCriteria;
    } else {
        criteria[this.model.primaryKey] = idOrCriteria;
    }

    //emitting event BEFORE
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "update", { model: this.model, criteria: criteria, ctx: ctx, data: data });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }

    var result = await this.model.update(criteria, data);
    //emitting event AFTER
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(this.modelName, "after", "update", { model: this.model, criteria: criteria, ctx: ctx, data: data, result: result });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }

    return result;
}

//==========================================================================================
//CREATE

iModel.prototype.create = async function (data, ctx) {
    if(!ctx) ctx = {};
    
    //emitting event BEFORE
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "create", { model: this.model, ctx: ctx, data: data });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }

    var result = await this.model.create(data);
    //emitting event AFTER
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(this.modelName, "after", "create", { model: this.model, ctx: ctx, data: data, result: result });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }

    return result;


}
//==========================================================================================
//DELETE

iModel.prototype.delete = async function (idOrCriteria, ctx) {
    if(!ctx) ctx = {};
    let criteria = {};
    if ((!!idOrCriteria) && (idOrCriteria.constructor === Object)) {
        criteria = idOrCriteria;
    } else {
        criteria[this.model.primaryKey] = idOrCriteria;
    }

    //emitting event BEFORE
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(this.modelName, "before", "delete", { model: this.model, criteria: criteria, ctx: ctx });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
    }

    var result = await this.model.destroy(criteria.where);
    
    //emitting event AFTER
    if (global.events && this.useEvents) {
        global.lib.blueHelper.emitEvent(this.modelName, "after", "delete", { model: this.model, criteria: criteria, ctx: ctx, result: result });
        if (ctx.res && ctx.res._headerSent) return;//if any other middleware has ended it
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