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
    if (swapi.events && this.useEvents) {
        ctx.model = this.model
        ctx.criteria = criteria
        ctx.cancel == false;
        global.lib.blueHelper.emitEvent(this.modelName, "before", "find", ctx);
        if (ctx.cancel == true) return false;//if any other middleware has ended it
    }
     
    var query = this.model.find(criteria);
    if (criteria.populate) {
        /*
            let populate = ['name1', {name2:{filter:1}} ]
        */
        let popItens = [];
        if ((!!criteria.populate) && (criteria.populate.constructor === Array))  popItens = criteria.populate
        else popItens = criteria.populate.split(",")
        
        if (popItens[0].toLowerCase() == "all") {
            // populate all
            query.populateAll();
        }
        else  {
            //populate models with names
            popItens.map(function (element) {
                let name, filter = {}
                if ((!!element) && (element.constructor === Object)) {
                    name = Object.keys(element)[0] //get name
                    filter = element[name]
                } else {
                    name = element
                }
                query.populate(name.trim(), filter)
            });
        } 
        delete criteria.populate;
    }
    
    var result = await promisefyQueryExec(query);

    //emitting event AFTER
    if (swapi.events && this.useEvents) {
        ctx.result = result;
        global.lib.blueHelper.emitEvent(ctx.modelName, "after", "find", ctx);
    }

    return result;
}

//==========================================================================================
//COUNT

iModel.prototype.count = async function (criteria, ctx) {
    if(!ctx) ctx = {};

    //emitting event BEFORE
    if (swapi.events && this.useEvents) {
        ctx.model = this.model
        ctx.criteria = criteria
        ctx.cancel == false;
        global.lib.blueHelper.emitEvent(this.modelName, "before", "find", ctx);
        if (ctx.cancel == true) return false;//if any other middleware has ended it
        
    }

    var result = await this.model.count(criteria);

    //emitting event AFTER
    if (swapi.events && this.useEvents) {
        ctx.result = result;
        global.lib.blueHelper.emitEvent(ctx.modelName, "after", "find", ctx);
        
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
        criteria.where = {};
        criteria.where[this.model.primaryKey] = idOrCriteria;
    }

    //emitting event BEFORE
    if (swapi.events && this.useEvents) {
        ctx.model = this.model
        ctx.criteria = criteria
        ctx.cancel == false;
        global.lib.blueHelper.emitEvent(this.modelName, "before", "find", ctx);
        
        if (ctx.cancel == true) return false;//if any other middleware has ended it
    }


    var query = this.model.find(criteria);
    var result = await promisefyQueryExec(query);

    //emitting event AFTER
    if (swapi.events && this.useEvents) {
        ctx.result = result;
        global.lib.blueHelper.emitEvent(ctx.modelName, "after", "find", ctx);
        
    }
    if (result && result[0]) return result[0];
    else return false;
}

//==========================================================================================
//UPDATE

iModel.prototype.update = async function (idOrCriteria, data, ctx) {
    if(!ctx) ctx = {};
    let criteria = {};
    let byId = false;
    if ((!!idOrCriteria) && (idOrCriteria.constructor === Object)) {
        criteria = idOrCriteria;
    } else {
        criteria.where = {};
        criteria.where[this.model.primaryKey] = idOrCriteria;
        byId = true;
    }

    //emitting event BEFORE
    if (swapi.events && this.useEvents) {
        ctx.model = this.model
        ctx.criteria = criteria
        ctx.data = data
        ctx.cancel == false;
        global.lib.blueHelper.emitEvent(this.modelName, "before", "update", ctx);
        
        if (ctx.cancel == true) return false;//if any other middleware has ended it
    }

    var result = await this.model.update(criteria, data);
    //emitting event AFTER
    if (swapi.events && this.useEvents) {
        ctx.result = result;
        global.lib.blueHelper.emitEvent(this.modelName, "after", "update", ctx);
        
    }

    //if (byId = true && result[0]) result = result[0]
    return result;
}

//==========================================================================================
//CREATE

iModel.prototype.create = async function (data, ctx) {
    if(!ctx) ctx = {};
    
    //emitting event BEFORE
    if (swapi.events && this.useEvents) {
        ctx.model = this.model
        ctx.data = data
        ctx.cancel == false;
        global.lib.blueHelper.emitEvent(this.modelName, "before", "create", ctx);
        
        if (ctx.cancel == true) return false;//if any other middleware has ended it
    }

    var result = await this.model.create(data);
    //emitting event AFTER
    if (swapi.events && this.useEvents) {
        ctx.result = result
        global.lib.blueHelper.emitEvent(this.modelName, "after", "create", ctx);
        
    }

    return result;


}
//==========================================================================================
//DELETE

iModel.prototype.delete = async function (idOrCriteria, ctx) {
    if(!ctx) ctx = {};
    let criteria = {};
    let byId = false;
    if ((!!idOrCriteria) && (idOrCriteria.constructor === Object)) {
        criteria = idOrCriteria;
    } else {
        criteria.where = {};
        criteria.where[this.model.primaryKey] = idOrCriteria;
        byId = true;
    }

    //emitting event BEFORE
    if (swapi.events && this.useEvents) {
        ctx.model = this.model
        ctx.criteria = criteria
        ctx.cancel == false;
        global.lib.blueHelper.emitEvent(this.modelName, "before", "delete", ctx);
        
        if (ctx.cancel == true) return false;//if any other middleware has ended it
    }

    var result = await this.model.destroy(criteria.where);
    
    //emitting event AFTER
    if (swapi.events && this.useEvents) {
        ctx.result = result;
        global.lib.blueHelper.emitEvent(this.modelName, "after", "delete", ctx);
        
    }
    //if (byId = true && result[0]) result = result[0]
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