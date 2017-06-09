'use strict'
const _             = require('lodash');
const validator     = require('validator');

function mapErrorMessage(err){
  let status = err.status || err.statusCode || 500;
  let message = '' || err.err || err.error || err.message;

  // Check custom message (this message can show to public)
  try{
    let errObj = JSON.parse(err.message);
    status = errObj.status || status;
    message = errObj.message || message;
  }catch(e){}
  
  // default message
  if (!message){
    switch(status){
      case 400: message = 'Bad Request'; break;
      case 401: message = 'Unauthorized'; break;
      case 403: message = 'Forbidden'; break;
      case 404: message = 'Not Found'; break;
      case 408: message = 'Request Timeout'; break;
      case 500: message = 'Internal Server Error'; break;
      case 501: message = 'Not Implemented'; break;
      case 502: message = 'Bad Gateway'; break;
      case 503: message = 'Service Unavailable'; break;
      default: message = 'Error'; break;
    }
  }
  return {status:status, message:message}
}

function _checkRequired(key , param) {
  return (_.isNull(param) || _.isUndefined(param)) ? false : true
}

function vadidate(specs , params){
  let error = [];
  for(let key in specs) { 
    if(specs[key].indexOf("required") != -1) {
      if (!_checkRequired(key, params[key])) error.push(key + ' required');
    }
    
    if(params[key]){
      if (specs[key].indexOf("number") != -1){
        if (!validator.isNumeric(params[key]+ '')) error.push(key + ' is not number');
      }
      if (specs[key].indexOf("decimal") != -1){
        if (!validator.isDecimal(params[key]+'')) error.push(key + ' is not decimal');
      }
      if (specs[key].indexOf("int") != -1){
        if (!validator.isInt(params[key]+ '')) error.push(key + ' is not int');
      }
      if (specs[key].indexOf("date") != -1){
        if (!validator.isDate(params[key]) || !(params[key]).match(/^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/)) error.push(`${key} is not date`);
      }
      if (specs[key].indexOf("datetime") != -1){
        if (!validator.isDate(params[key]) || !(params[key]).match(/^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})\s(\d{2}):(\d{2}):(\d{2})$/)) error.push(`${key} is not datetime`);
      }
      if (specs[key].indexOf("iso_datetime") != -1){
        if (!validator.isDate(params[key]) || !(params[key]).match(/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2}).(\d+)Z/)) error.push(`${key} is not iso datetime`);
      }
      if (specs[key].indexOf("email") != -1){
        if (!validator.isEmail(params[key]+ '')) error.push(key + ' invalid format');
      }
      if (specs[key].indexOf("url") != -1){
        if (!validator.isURL(params[key]+ '')) error.push(key + ' is not url');
      }
    }
  }
 
  if(error.length > 0) {
    throw {status : 400, err : error.join()};
  }
  return params
}

function handleError(res , errData){
  console.log('handleError', errData);
  let err_msg = errData.err || errData.error || errData
  if(errData.status === 400)return res.status(400).send({status: 400,"error" : err_msg || "Bad Request"});
  else if(errData.status === 404)return res.status(404).send({status: 404,"error" : err_msg || "Not found"});
  else if(errData.status === 503)return res.status(503).send({status: 503,"error" : err_msg || "Internal Server Error"});
  else return res.status(errData.status || 500).send({status: errData.status || 500,"error" : err_msg || errData});
}

function handleResponse(res, resData){
    console.log('mapResponse', resData)
    return res.status(200).send(resData)
}

module.exports = {
  mapErrorMessage,
  vadidate,
  handleError,
  handleResponse
}