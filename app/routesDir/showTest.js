'use strict';
//var express = require('express');
var router = require('express').Router();

// with security module from /security
// custom security here
 
/* GET home page. */
router.get('/', swapi.security.apikey, function(req, res, next) {
  		res.render(
		"testView",
		{message: "Olá! Custom routes working"}
		);
});

module.exports = router;
