
module.exports = {
    name: "express-error",
    run: async function (app) {
        //commom express errors
        app.use(function (err, req, res, next) {
            if (err) {
                let resp = { error: {code: "err_express_general", title:"Erro geral express",details:{message: err.message, stack: err.stack}} }
                res.status(err.status).send(resp);
            }
            next(err);
        })
      
    }
  }
  