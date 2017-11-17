//'use strict';

const fs = require("fs");
const path = require('path');
var clone = require('clone');
const merge = require('merge');

function util() {
    return true;
};

util.decodeJsonStr = function(str){
	var urlencode = require("urlencode");
	var result = {};
	try {
		let decoded = urlencode.decode(str);
		result = JSON.parse( decoded );
	} catch (err) {
		return {};
	}
	return result;
};


util.CheckFilterJson = function (input) {
    let filter = {};
    if (input) {
        if (typeof input === 'string') {
            filter = util.decodeJsonStr(input);
        }
        if (typeof input === 'object') {
            filter = input;
        }
    }
    return filter;
};

util.AddAndFilter = function (pfilter, criteria) {
    var filter = {};

    if (!pfilter) {
        filter = {};
    } else {
        if (pfilter.where) filter = clone(pfilter.where);
        else filter = clone(pfilter);
    }

    if (filter.or) {
        var originalObj = JSON.parse(JSON.stringify(filter.or)); //clone obj
        filter = { "and": [{ "or": originalObj }, criteria] };
    } else if (filter.and) {
        if (Array.isArray(filter.and)) {
            filter.and.push(criteria);
        } else {
            filter.and = merge(filter.and, criteria);
        }
    } else {
        if (Array.isArray(filter)) {
            filter.push(criteria);
        } else {
            filter = merge(filter, criteria);
        }
    }
    pfilter = filter;
    return filter;
};

util.emitEvent = function (modelName, moment, action, ctx) {
	ctx.action = action;
	ctx.moment = moment;
	ctx.modelName = modelName;
	swapi.events.emit(`${moment}.${modelName}.${action}`, ctx);
}


util.getIdFilter = function (req, res, primaryKey, idParam) {
    if (!req.params[idParam]) {
        res.status(400).end(idParam + ' not defined');
        return;
    }
    let filter = {};
    //filter.where = {};
    filter[primaryKey] = req.params[idParam];
    return filter;
};


module.exports = util;