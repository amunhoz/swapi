var request = require('request');

//request with support for await
exports.request = async function (options) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) reject(error)
            else resolve(body)
        })
    })
}

