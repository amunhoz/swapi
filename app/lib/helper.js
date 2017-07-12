'use strict';

//create an api lib to be used from "api.lib.helper.funcion()"
function apilib() {
    return true;
};

apilib.funcUtil = async function (url, query, headers) {
    console.log(url);

};

module.exports = apilib;