module.exports = function(aLogLevel) {
  'use strict';

  var Utils = require('swagger-boilerplate').Utils;
  var logger = new Utils.MultiLevelLogger('Charts Implementation', aLogLevel);

  const charWrapper = new(require('./chartWrapper'))(aLogLevel);

  function dumpReq(req) {
    logger.log('req.path:', req.path, 'params:', req.params);
    logger.log('query:', req.query, 'body:', req.body);
    logger.log('req.user:', req.user, 'req.someData:', req.someData);
  }

  var barChartAPI = new(require('./barChart'))(aLogLevel);
  var lineChartAPI = new(require('./lineChart'))(aLogLevel);
  var doughnutChartAPI = new(require('./doughnutChart'))(aLogLevel);

  function setHeaders(aRes, length) {
    aRes.setHeader("Content-Type", "image/png");
    aRes.setHeader("Content-Length", length);
  }

  function generate(aRes, aData) {
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

  return {
    getBar: function getBar(aReq, aRes) {
      return generate(aRes, barChartAPI.getData(aReq));
    },
    getLine: function getLine(aReq, aRes) {
      return generate(aRes, lineChartAPI.getData(aReq));
    },
    getDoughnut: function getLine(aReq, aRes) {
      return generate(aRes, doughnutChartAPI.getData(aReq));
    }
  };

};