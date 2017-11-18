
module.exports = {
    name: "express-error",
    run: async function (app) {
      
        app.use(function (err, req, res, next) {
            if (err) {
		let resp = { sucess: false, error: {code:  999997, message: err.message, stack: err.stack} }
                res.status(err.status).send(resp);

            }
            next(err);
        })
      
    }
  }
  