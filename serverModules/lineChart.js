function LineChart(aLogLevel) {
  'use strict';

  // http://<host>:<port>/charts/line?values=12,19,3,17,6,3,7;2,29,5,5,2,3,10&labels=apples,orange&lineLabels=M,T,W,T,F,S,S&backgroundColor=2551530000.4,1532550510.4

  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('LineChar', aLogLevel);
  const chartUtils = new(require('./chartUtils'))(aLogLevel);

  function getData(aReq) {
    let query = aReq.query || {};
    let lineLabels = chartUtils.getValuesAsArray(query.lineLabels, ',');
    let valuesAsStr = chartUtils.getValuesAsArray(query.values, ';');
    let values = [];
    for (let i = 0, l = valuesAsStr.length; i < l; i++) {
      values.push(chartUtils.getValuesAsArray(valuesAsStr[i], ','));
    }
    let labels = chartUtils.getValuesAsArray(query.labels, ',');
    let backgroundColor = query.backgroundColor && chartUtils.getColors(query.backgroundColor) || [];

    let legend = query.legend || '';

    if (!values || values.length <= 0) {
      return null;
    }

    labels = chartUtils.rectifyArrayLength(labels, values.length, '');
    lineLabels = chartUtils.rectifyArrayLength(lineLabels, values[0].length, '');

    let dataSet = [];
    for (let i = 0, l = values.length; i < l; i++) {
      let aValue = {
        'label': labels[i],
        'data': values[i],
        'backgroundColor': backgroundColor[i]
      };
      dataSet.push(aValue);
    }

    let data = {
      type: 'line',
      data: {
        labels: lineLabels,
        datasets: dataSet
      },
      options: chartUtils.getChartOptions(legend)
    };
    return data;
  }

  return {
    getData: getData
  };
}

module.exports = LineChart;
