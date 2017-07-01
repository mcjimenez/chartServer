function BarChart(aLogLevel) {
  'use strict';

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
