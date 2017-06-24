module.exports = function(aLogLevel) {
  'use strict';

  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('Charts Implementation', aLogLevel);

  const charWrapper = new(require('./chartWrapper'))(aLogLevel);

  const DEFAULT_WIDTH = 400;
  const DEFAULT_HEIGHT = 400;

  function dumpReq(req) {
    logger.log('req.path:', req.path, 'params:', req.params);
    logger.log('query:', req.query, 'body:', req.body);
    logger.log('req.user:', req.user, 'req.someData:', req.someData);
  }

  const barChartAPI = new(require('./barChart'))(aLogLevel);
  const lineChartAPI = new(require('./lineChart'))(aLogLevel);
  const genericAPI = new(require('./genericChart'))(aLogLevel);

  function setHeaders(aRes, length) {
    aRes.setHeader("Content-Type", "image/png");
    aRes.setHeader("Content-Length", length);
  }

  function generate(aReq, aRes, aData) {
    let query = aReq.query || {};
    let width = query.width || DEFAULT_WIDTH;
    let height = query.height || DEFAULT_HEIGHT;
    charWrapper.setSize(width, height);

    if (!aData) {
      aRes.status(500).send("No values received");
    }
    charWrapper.generate(aData).
      then(blob => {
        setHeaders(aRes, blob.length);
        aRes.status(200).send(blob);
      }).
      catch(error => {
        logger.error('There was an error generating the chart. ', error.message);
        aRes.status(500).send(error.message);
      });
  }

  function normalize(aReq) {
    let query = aReq.query || {};

    if (!query.width) {
      query.width = DEFAULT_WIDTH;
    }
    if (!query.height) {
      query.height = DEFAULT_HEIGHT;
    }
    aReq.query = query;
    return aReq;
  }

  return {
    getBar: function getBar(aReq, aRes) {
      return generate(aReq, aRes, barChartAPI.getData(normalize(aReq)));
    },
    getLine: function getLine(aReq, aRes) {
      return generate(aReq, aRes, lineChartAPI.getData(normalize(aReq)));
    },
    getGeneric: function getGeneric(aReq, aRes) {
      return generate(aReq, aRes, genericAPI.getData(normalize(aReq)));
    }
  };

};