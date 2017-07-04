function Validator(aLogLevel) {
  'use strict';

  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('Validator', aLogLevel);
  const sharedSecret = process.env.SHARED_SECRET || '';
  const cryptUtils = require('./cryptUtils');
  const url = require('url');

  const AUTH_PARAM = '&auth=';

  function isValid(aReq) {
    if (!sharedSecret) {
      logger.log('sharedSecret has not been set. No validation needed');
      return true;
    }

    let query = aReq.query || {};

    let paramB64 = query.param;
    let authRec = query.auth;
    if (!paramB64 || !authRec) {
      return false;
    }

    var auth = cryptUtils.getAuthToken(paramB64, sharedSecret);

    return auth.toLowerCase() === authRec.toLowerCase();
  }

  return {
    isValid: isValid
  };
}

module.exports = Validator;
