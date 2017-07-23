
module.exports = {
    name: "express-async-error",
    run: async function (app) {
        //from require('express-async-errors');

        const Layer = require('express/lib/router/layer');

        Object.defineProperty(Layer.prototype, "handle", {
            enumerable: true,
            get: function () { return this.__handle; },
            set: function (fn) {
                if (isAsync(fn)) {
                    fn = wrap(fn);
                }

                this.__handle = fn;
            }
        });
        function isAsync(fn) {
            const type = Object.toString.call(fn.constructor);
            return type.indexOf('AsyncFunction') !== -1;
        };
        function wrap(fn) {
            return (req, res, next) => {
                const routePromise = fn(req, res, next);
                if (routePromise.catch) {
                    routePromise.catch(err => {
                        sysLog.error(err);
                        res.status(500).send({ sucess: false, error: "internal server error" });
                    });
                    //routePromise.catch(err => next(err));
                }
            }
        };

        function treatError(err) {
            sysLog.error(err);
            res.status(500).send({ sucess: false, error: "internal server error" });
        }

        console.log("(init) Express async errors loaded");
    }
}
