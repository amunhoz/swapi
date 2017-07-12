//example to load exclusive api things

module.exports = {
    priority: 999,
    enabled: true,
    name: "Tests",
    run: async function (app) {

        console.log(" -- (api init) Tests cache loaded");
        
        //test queue
        for (var i = 0; i < 5; i++) {

            let x = i; //new variable to this context, wont change value in other queue
            swapi.queue.push(function (cb) {
                console.log("test queue"+x);
                cb();
            });

        }
        

    }
}

function testBull(p1, p2) {
    console.log(p1);
    console.log(p2);

}
