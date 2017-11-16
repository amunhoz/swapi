const hjson = require('hjsonfile');
var mm = require('micromatch');

module.exports = {
    name: "permissions",
    run: async function (app) {
        var mm = require('micromatch');
        let nroutes = app._router.stack.length;
        let pconfig = hjson.readFileSync(swapi.config.locations.permissions);
        var removePath = app.mountpath;
        for (var i = 0; i < nroutes; i++) {
            let route =  app._router.stack[i].route;
            if (!route) continue;
            let routePath = route.path.replace(removePath,"")
            let finalPerms = {};
            for (var ig = 0; ig < pconfig.length; ig++) {
                //groups
                let group = pconfig[ig];
                let groupNames = group.group.split(",");

                for (var ip = 0; ip < group.permissions.length; ip++) {
                    let perm = group.permissions[ip];
                    //permissions
                    if (mm.isMatch(routePath, perm.resource) ){
                        //route inside pattern
                        for (var im = 0; im < perm.methods.length; im++) { 
                            let method = perm.methods[im].toLowerCase();
                            if (route.methods[method]) {
                                groupNames.map(name => finalPerms[name] = perm.action);
                            }

                        }
                    }
                }
                //default deny
                if (!finalPerms[groupNames[0]]){
                    groupNames.map(name => finalPerms[name] = "deny");
                } 
            }
            route.permissions = finalPerms;
        }
        swapi.lib.permission = {};
        swapi.lib.permission.check = function (req, group) {
            let curPerm = req.route.permissions[group];
            if (!curPerm) return "deny";
            return curPerm;
        }

        console.log("(init) Permissions loaded");
    }
}

