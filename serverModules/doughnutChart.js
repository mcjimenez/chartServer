function DoughnutChart(aLogLevel) {
  'use strict';

  // http://<host>:<port>/charts/doughnut?values=12,19,3,17,28,24,7&labels=Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601,0520730941

  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('DoughnutChar', aLogLevel);
  const chartUtils = new(require('./chartUtils'))(aLogLevel);
  const pieChart = new(require('./pieChart'))(aLogLevel);

  function getData(aReq) {
    let data = pieChart.getData(aReq);
    if (!data) {
      return null;
    }
    data.type = 'doughnut';
    return data;
  }

  return {
    getData: getData
  };
}

module.exports = DoughnutChart;
