const moment = require("moment");

async function authorize(req, res, next) {
     
     if (req.headers.apikey) {
         if (req.headers.apikey = "123") {
			 return next();
		 } else {
			 res.status(403).send({sucess:false, error:"Expired token."});
		 }
     } else {
		 res.status(403).send({sucess:false, error:"Unauthorized."});
     }

}
module.exports = authorize;