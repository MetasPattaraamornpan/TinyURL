
const express 	= require('express')
const bodyParser= require('body-parser')
const useragent = require('express-useragent')
const promise 	= require('bluebird')
const pg_promise= require('pg-promise')({ promiseLib: promise })
const config 	= require('./config/environment')
const http 		= require('http')
const swagger 	= require('swagger-express')
const path      = require('path');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
console.log('NODE_TLS_REJECT_UNAUTHORIZED=0')

//load
module.exports = () => promise.try(() => preload()).then(start).catch(handleError)

//error
function handleError(err) {
    console.log('handleError', err)
}

//pre start
function preload() {
    console.log('load pre-start')
}

//app start
function start() {
    let app = express()
    let server = http.createServer(app)
    app.disable('x-powered-by')
    app.set('trust proxy', true);
    app.set('port', process.env.PORT || config.port)
    
    app.use(bodyParser.urlencoded({ extended:true,limit:1024*10}))
    app.use(function(err, req, res, next) {
        if (err) throw err
        return next();
    });

    app.use(useragent.express())

    //load routers
    require('./router')(app)
    //start server
    server.listen(app.get('port'), function() {
        let msg = "Start on port:" + (app.get('port'))
        console.log(msg)
        return true
    });
    app.server = server
    return app
}
