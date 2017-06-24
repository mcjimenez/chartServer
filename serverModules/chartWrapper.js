function ChartWrapper(aLogLevel) {
  'use strict';

  var Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('ChartWrapper', aLogLevel);
  const jsdom = require('jsdom');
  jsdom.defaultDocumentFeatures = {
    FetchExternalResources: ['script'],
    ProcessExternalResources: true
  };

  const HTML = '<html><body><div id="chart-div" style="font-size:12; width:800px; height:800px;"><canvas id="myChart" width="400" height="400"></canvas></div></body></html>';
  const SCRIPTS = ['https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.2/Chart.js'];

  function generate(options) {
    return new Promise((resolve, reject) => {
        jsdom.env(HTML, SCRIPTS, function(err, window) {
          try{
            var document = window.document;
            var Chart = window.Chart;
            var canvas = document.getElementById('myChart');
            var ctx = canvas.getContext('2d');
            var myChart = new Chart(ctx, options);
            canvas.toBlob(function(blob) {
              //var fs = require('fs'),
              //out = fs.createWriteStream('./results/chartLineN2.png');
              //out.write(jsdom.blobToBuffer(blob));
              resolve(jsdom.blobToBuffer(blob));
            }, 'image/png');
          } catch (error) {
            logger.error('There was an error generating the chart. ', error);
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
