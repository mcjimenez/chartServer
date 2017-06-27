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

  function generate(aReq, aRes) {
    let data = aReq.parsedData;
    let query = aReq.query || {};

    let width = query.width || DEFAULT_WIDTH;
    let height = query.height || DEFAULT_HEIGHT;

    charWrapper.setSize(width, height);

    if (!data) {
      aRes.status(500).send("No values received");
    }

    charWrapper.generate(data).
      then(blob => {
        setHeaders(aRes, blob.length);
        aRes.status(200).send(blob);
      }).
      catch(error => {
        logger.error('There was an error generating the chart. ', error.message);
        aRes.status(500).send(error.message);
      });
  }

  let parsers = {
    'bar': barChartAPI,
    'line': lineChartAPI,
    'pie': genericAPI,
    'polarArea': genericAPI,
    'doughnut': genericAPI
  };

  function normalize(aReq, aRes, aNext) {
    let query = aReq.query || {};

    if (!query.width) {
      query.width = DEFAULT_WIDTH;
    }
    if (!query.height) {
      query.height = DEFAULT_HEIGHT;
    }
    aReq.query = query;
    aNext();
  }

  function parseData(aReq, aRes, aNext) {
    if (!aReq.path.startsWith('/charts')) {
      return aNext();
    }
    let typeOfChart = aReq.path.split('/')[2];

    // Check for type...
    if (parsers[typeOfChart] && typeof parsers[typeOfChart].getData === 'function') {
      aReq.typeOfChart = typeOfChart;
      aReq.parsedData = parsers[typeOfChart].getData(aReq);
    } else {
      logger.error('Invalid/unknown type of chart!.', aReq.path);
    }
    return aNext();
  }

  return {
    normalize: normalize,
    parseData: parseData,
    getChart: generate
  };

};