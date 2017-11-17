'use strict';
//var express = require('express');
var router = require('express').Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  		res.render("testView",
		{message: "Olá! Custom routes working inside directory"}
		);
		
});

module.exports = router;
