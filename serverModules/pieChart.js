function PieChart(aLogLevel) {
  'use strict';

  // http://<host>:<port>/charts/doughnut?values=12,19,3,17,28,24,7&labels=Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday&backgroundColor=0462041131,0521522191,1491651661,1550891821,2411960151,2310760601,0520730941

  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('DoughnutChar', aLogLevel);
  const chartUtils = new(require('./chartUtils'))(aLogLevel);

  function getData(aReq) {
    let query = aReq.query || {};
    let labels = chartUtils.getValuesAsArray(query.labels, ',');
    let backgroundColor = query.backgroundColor && chartUtils.getColors(query.backgroundColor) || [];
    let values = chartUtils.getValuesAsArray(query.values, ',');

    if (!values || values.length <= 0) {
      return null;
    }

    labels = chartUtils.rectifyArrayLength(labels, values.length, '');

    let data = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          backgroundColor: backgroundColor,
          data:values
        }]
      },
      options: chartUtils.getChartOptions()
    };

    return data;
  }

  return {
    getData: getData
  };
}

module.exports = PieChart;