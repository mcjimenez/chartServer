function LineChart(aLogLevel) {
  'use strict';

  // http://<host>:<port>/charts/line?backgroundColor=2551530000.0,2132362430.5&borderColor=1550741491,0361632061&values=410,400,410,600,400,500,380;380,580,450,430,570,600,800&labels=apples,orange&lineLabels=01,06,12,18,24,31,37&legend=display:true,position:bottom&disableCurve=1

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
    let backgroundColor = query.backgroundColor && chartUtils.getColors(query.backgroundColor, '') || [];
    let borderColor = query.borderColor && chartUtils.getColors(query.borderColor, '') || [];
    let legend = query.legend || '';
    let disableCurve = query.disableCurve || false;
    if (!values || values.length <= 0) {
      return null;
    }

    labels = chartUtils.rectifyArrayLength(labels, values.length, '');
    lineLabels = chartUtils.rectifyArrayLength(lineLabels, values[0].length, '');

    let dataSet = [];
    for (let i = 0, l = values.length; i < l; i++) {
      let aValue = {
        'label': labels[i],
        'data': values[i]
      };
      if (backgroundColor[i] !== '') {
        aValue.backgroundColor = backgroundColor[i];
      }
      if (borderColor[i] !== '') {
        aValue.borderColor = borderColor[i];
      }
      dataSet.push(aValue);
    }

    var options = chartUtils.getChartOptions(legend);
    if (disableCurve) {
      options.elements = {
        line: {
          tension: 0 // disables bezier curves
        }
      };
    }

    let data = {
      type: 'line',
      data: {
        labels: lineLabels,
        datasets: dataSet
      },
      options: options
    };
    return data;
  }

  return {
    getData: getData
  };
}

module.exports = LineChart;
