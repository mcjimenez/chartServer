function BarChar(aLogLevel) {
  'use strict';

  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('barChar', aLogLevel);

  const charWrapper = new(require('./chartWrapper'))(aLogLevel);

  const DEFAULT_COLOR_EVEN = 'rgba(255, 255, 255, 1)';
  const DEFAULT_COLOR_ODD = 'rgba(0, 0, 0, 1)';

  const chartOptions = {
    responsive: false,
    animation: false,
    width: 400,
    height: 400,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  function getValuesAsArray(aQuery, key) {
    return aQuery[key] && aQuery[key].split(',') || [];
  }

  function notValidColor(color) {
    return isNaN(color) || color < 0 || color > 255;
  }

  function notValidAlpha(alpha) {
    return isNaN(alpha) || alpha < 0 || alpha > 1;
  }

  function getColors(value) {
    var colors = [];
    var strOfColors = value.split(',');
    for (var i = 0, l = strOfColors.length; i < l; i++) {
      var elem = strOfColors[i];
      var defaultColor = i % 2 ? DEFAULT_COLOR_ODD : DEFAULT_COLOR_EVEN;
      var aColor = [];
      if (elem.length < 10 || elem.length > 12) {
        colors.push(defaultColor);
        continue;
      }
      var red = parseInt(elem.substring(0, 3));
      var green = parseInt(elem.substring(3, 6));
      var blue = parseInt(elem.substring(6, 9));
      var alpha = parseFloat(elem.substring(9));
      if (notValidColor(red) || notValidColor(green) || notValidColor(blue) ||
          notValidAlpha(alpha)) {
        colors.push(defaultColor);
        continue;
      }
      colors.push('rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')');
    }
    return colors;
  }

  function setHeaders(aRes, length) {
    aRes.setHeader("Content-Type", "image/png");
    aRes.setHeader("Content-Length", length);
  }

  function rectifyArrayLength(aArr, aLength, aFiller) {
    var newArr = aArr;
    var currentLength = aArr.length;
    var length = aLength;
    if (currentLength < aLength) {
      for (var i = currentLength; i < length; i++) {
        newArr.push(aFiller);
      }
    } else if (currentLength > length) {
      newArr = aArr.splice(0, length);
    }
    return newArr;
  }

  function create(aReq, aRes) {
    var query = aReq.query || {};
    var values = getValuesAsArray(query, 'values');
    var labels = getValuesAsArray(query, 'labels');
    var barLabel = query.barLabel || '';
    var backgroundColor = query.backgroundColor && getColors(query.backgroundColor) || [];
    var borderColor = query.borderColor && getColors(query.borderColor) || [];
    var borderWidth = parseInt(query.borderWidth);

    if (!values || values.length <= 0) {
      aRes.status(500).send("No values received");
    }

    if (isNaN(borderWidth)) {
      borderWidth = 1;
    }

    labels = rectifyArrayLength(labels, values.length, '');

    var data = {
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
      options: chartOptions
    };

    charWrapper.generate(data).
      then(blob => {
        //logger.log('Bar chart generated. ', JSON.stringify(blob));
        setHeaders(aRes, blob.length);
        aRes.status(200).send(blob);
      }).
      catch(error => {
        logger.error('There was an error generating the bar chart. ', error.message);
        aRes.status(500).send(error.message);
      });
  }

  return {
    create: create
  };
}

module.exports = BarChar;