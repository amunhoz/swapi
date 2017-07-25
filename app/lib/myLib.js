'use strict';

//create an api lib to be used from "swapi.lib.myLib.funcion()"
function myLib() {
    return true;
};
myLib.funcUtil = async function (url, query, headers) {
    console.log(url);

};

module.exports = myLib;