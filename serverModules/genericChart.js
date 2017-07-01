function GenericChart(aLogLevel) {
  'use strict';

  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('GenericChar', aLogLevel);
  const chartUtils = new(require('./chartUtils'))(aLogLevel);

  function getData(aReq) {
    let query = aReq.query || {};
    let type = aReq.typeOfChart;

    let labels = JSON.parse(query.labels);
    let backgroundColor = query.backgroundColor && chartUtils.getColors(JSON.parse(query.backgroundColor)) || [];
    let values = JSON.parse(query.values);

    if (!values || values.length <= 0) {
      return null;
    }

    labels = chartUtils.rectifyArrayLength(labels, values.length, '');

    let data = {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          backgroundColor: backgroundColor,
          data: values
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

module.exports = GenericChart;
