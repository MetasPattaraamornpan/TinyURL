'use strict'

const promise 		= require('bluebird')
const commons      	= require('../helpers/commons')
const urlService	= require('../services/urlservice')

function shortenurl(req, res) {
	console.log('shortenurl', req.body)
	let specs = {
		inputurl: ['required', 'url'],
		alias: []
	}
	
	return promise.try(() => commons.vadidate(specs , req.body))
		.then(() => urlService.shortenurl(req.body))
		.then((resData)=> commons.handleResponse(res, resData))
		.catch((err)=> commons.handleError(res, err))
}

function geturl(req, res) {
	console.log('geturl', req.params)
	let specs = {
		key: ['required'],
	}
	
	return promise.try(() => commons.vadidate(specs , req.params))
		.then(() => urlService.geturl(req.params))
		.then((url)=> {
			console.log('redirect:', url)
			return url?res.redirect(url):res.send('URL not found')
		})
		.catch((err)=> commons.handleError(res, err))
}

module.exports = {
    shortenurl,
	geturl
}