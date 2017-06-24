function BarChart(aLogLevel) {
  'use strict';
  // http://<host>:<port>/charts/bar?values=12,19,3,5,2,3&labels=red,blue,yellow,green,purple,orange&barLabel=of%20Votes&backgroundColor=2550991320.2,0541622350.2,2552060860.2,0751921920.2,1531022550.2,2551590640.2&borderColor=2550991321,0541622351,2552060861,0751921921,1531022551,2551590641&borderWidth=
  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('BarChar', aLogLevel);

  const chartUtils = new(require('./chartUtils'))(aLogLevel);

  function getData(aReq) {
    let query = aReq.query || {};
    let values = chartUtils.getValuesAsArray(query.values, ',');
    let labels = chartUtils.getValuesAsArray(query.labels, ',');
    let barLabel = query.barLabel || '';
    let backgroundColor = query.backgroundColor && chartUtils.getColors(query.backgroundColor) || [];
    let borderColor = query.borderColor && chartUtils.getColors(query.borderColor) || [];
    let borderWidth = parseInt(query.borderWidth);

    if (!values || values.length <= 0) {
      return null;
    }

    if (isNaN(borderWidth)) {
      borderWidth = 1;
    }

    labels = chartUtils.rectifyArrayLength(labels, values.length, '');

    let data = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: barLabel,
          data: values,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: borderWidth
        }]
      },
      options: chartUtils.getChartOptions(query)
    };

    return data;
  }

  return {
    getData: getData
  };
}

module.exports = BarChart;
