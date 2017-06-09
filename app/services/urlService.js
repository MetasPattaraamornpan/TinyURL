'use strict'
const sh      = require("shorthash");
const config 	= require('../config/environment')

let hashMap = {}

function shortenurl(params){
  console.log('shortenurl', params)
  //check if have alias or not
  let key = params['alias'] ? params.alias : sh.unique(params.inputurl)
  hashMap[key] = params.inputurl
  return 'TinyUrl:'+config.baseUrl+key
}

function geturl(params){
  console.log('geturl', params)
  return hashMap[params.key]
}

module.exports = {
  shortenurl,
  geturl
}