
module.exports = {
    name: "express-error",
    run: async function (app) {
      
        app.use(function (err, req, res, next) {
            if (err) {
                res.status(err.status).send({"success":false, error: (err) })
            }
            next(err);
        })
      
    }
  }
  