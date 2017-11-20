'use strict';
var router = require('express').Router();

// no security here
router.get('/', async function(req, res, next) {
  		res.render("testView",
		{message: "Olá! Custom routes working inside directory"}
		);
		
});

module.exports = router;
