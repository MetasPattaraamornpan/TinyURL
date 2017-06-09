'use strict'

// utill
const mapErrorMessage       = require('./helpers/commons').mapErrorMessage
// routers  
const router 	            = require('express').Router()

const urlController         = require('./controllers/urlcontroller')

module.exports = function(app) {

    
    router
        .post('/shorten_url', urlController.shortenurl)
        

    app
        .use('/api/v1/', router)
        .get('/:key', urlController.geturl)
    //render fontend
        .use('/', function(req, res) {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                <title>Shorten URL</title>
                </head>
                <body>
                    <form action="/api/v1/shorten_url" method="post" enctype="application/x-www-form-urlencoding">
                        <div>
                        <h1>Shorten URL</h1>
                        <p>Enter a long URL to make tiny</p>
                        <input name="inputurl" type="text">
                        <br>
                        <br>
                        <i>alis name (optional) http://localhost:5000/</i><input name="alias" type="text">
                        <br>
                        <input type="submit" value="Submit">
                        </div>
                    </form>
                </body>
                </html>`);
        })
    
    // Not found route
    app.use(function(req, res, next) {
        throw {status : 404, err : `"${req.url}" not found`}
    })

    // Error handle
    // Note : we should not show internal error message
    app.use(function(err, req, res, next) {
        let errObj = mapErrorMessage(err)

        // log error stack
        console.log('[Error ' + errObj.status + '] ', err)

        // reply error
        if (errObj.status) res.status(errObj.status)

        res.send({status: errObj.status,message: errObj.message })
        return;
    })
}
