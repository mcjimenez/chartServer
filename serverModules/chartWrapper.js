function ChartWrapper(aLogLevel) {
  'use strict';

  var Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('ChartWrapper', aLogLevel);
  const jsdom = require('jsdom');
  jsdom.defaultDocumentFeatures = {
    FetchExternalResources: ['script'],
    ProcessExternalResources: true
  };

  const HTML = '<html><body><div id="chart-div" style="font-size:12; width:800px; height:800px;"><canvas id="myChart" width="400" height="400" style="width:400px;height:400px"></canvas>></div></body></html>';
  const SCRIPTS = ['https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.2/Chart.js'];
//const SCRIPTS = ['https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js'];
  function generate(options) {
    logger.log("*** GENERANDO");
    return new Promise((resolve, reject) => {
        jsdom.env(HTML, SCRIPTS, function(err, window) {
          logger.log("*** Callback jsdom");
          try{
            var document = window.document;
            var Chart = window.Chart;
            var canvas = document.getElementById('myChart');
            var ctx = canvas.getContext('2d');
            var myChart = new Chart(ctx, options);//options);
            logger.log("*** myChart:",(myChart?"EXISTE":"NO EXISTE"));
            logger.log("*** canvas:",(canvas?"EXISTE":"NO EXISTE"));
            logger.log("*** canvas.keys:",(Object.keys(canvas)));
            canvas.toBlob(function(blob) {
              logger.log("*** toBlob:");
              //var fs = require('fs'),
              //out = fs.createWriteStream(./results/chartN3.png');
              //out.write(jsdom.blobToBuffer(blob));
              //resolve(blob);
              resolve(jsdom.blobToBuffer(blob));
            }, 'image/png');
          } catch (error) {
            logger.error('generate -> There was an error.', error);
            reject(error);
          }
        });
    });
  }

  return {
    generate: generate
  };
}

module.exports = ChartWrapper;
