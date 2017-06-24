module.exports = function(aLogLevel) {
  'use strict';

  var Utils = require('swagger-boilerplate').Utils;
  var logger = new Utils.MultiLevelLogger('Charts Implementation', aLogLevel);

  function dumpReq(req) {
    logger.log('req.path:', req.path, 'params:', req.params);
    logger.log('query:', req.query, 'body:', req.body);
    logger.log('req.user:', req.user, 'req.someData:', req.someData);
  }

  var barCharAPI = new(require('./barChar'))(aLogLevel);

  return {
    getBar: barCharAPI.create
  };

};