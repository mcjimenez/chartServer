function ChartUtils(aLogLevel) {
  'use strict';

  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('CharUtils', aLogLevel);
  const charWrapper = new(require('./chartWrapper'))(aLogLevel);

  const DEFAULT_COLOR_EVEN = 'rgba(255, 255, 255, 1)';
  const DEFAULT_COLOR_ODD = 'rgba(0, 0, 0, 1)';

  const LEGEND_VALID_KEYS = ['display', 'position'];
  const LEGEND_POSITION_DEFAULT = 'top';
  const LEGEND_POSITIONS_VALID = ['left', 'top', 'bottom', 'right'];

  function notValidColor(color) {
    return isNaN(color) || color < 0 || color > 255;
  }

  function notValidAlpha(alpha) {
    return isNaN(alpha) || alpha < 0 || alpha > 1;
  }

  function getColors(aValue, aDefaultColor) {
    let colors = [];
    for (let i = 0, l = aValue.length; i < l; i++) {
      let elem = aValue[i];
      let defaultColor;
      if (aDefaultColor !== undefined) {
        defaultColor = aDefaultColor;
      } else {
        defaultColor = i % 2 ? DEFAULT_COLOR_ODD : DEFAULT_COLOR_EVEN;
      }
      if (elem.length < 10 || elem.length > 12) {
        colors.push(defaultColor);
        continue;
      }
      let red = parseInt(elem.substring(0, 3));
      let green = parseInt(elem.substring(3, 6));
      let blue = parseInt(elem.substring(6, 9));
      let alpha = parseFloat(elem.substring(9));
      if (notValidColor(red) || notValidColor(green) || notValidColor(blue) ||
          notValidAlpha(alpha)) {
        colors.push(defaultColor);
        continue;
      }
      colors.push('rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')');
    }
    return colors;
  }

  function rectifyArrayLength(aArr, aLength, aFiller) {
    let newArr = aArr;
    let currentLength = aArr.length;
    let length = aLength;
    if (currentLength < aLength) {
      for (let i = currentLength; i < length; i++) {
        newArr.push(aFiller);
      }
    } else if (currentLength > length) {
      newArr = aArr.splice(0, length);
    }
    return newArr;
  }

  function getJSONValue(aValues) {
    if (!aValues) {
      return null;
    }
    try {
      return JSON.parse(aValues);
    } catch (err) {
      logger.error("Error on json with axes options. ", err.message);
      return null;
    }
  }

  function getChartOptions(aQuery) {
    let width = aQuery.width || 400;
    let height = aQuery.height || 400;

    let legends = getJSONValue(aQuery.legend);

    let yAxes = getJSONValue(aQuery.yAxis);
    let xAxes = getJSONValue(aQuery.xAxis);

    let options = {
      responsive: false,
      animation: false,
      width: width,
      height: height,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
    };

    if (legends) {
      options.legend = legends;
    }

    if (yAxes || xAxes) {
      options.scales = {};
      if (yAxes) {
        options.scales.yAxes = [yAxes];
      }
      if (xAxes) {
        options.scales.xAxes = [xAxes];
      }
    }
    return options;
  }

  return {
    getColors: getColors,
    rectifyArrayLength: rectifyArrayLength,
    getChartOptions: getChartOptions
  };
}

module.exports = ChartUtils;