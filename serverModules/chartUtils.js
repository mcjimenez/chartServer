function ChartUtils(aLogLevel) {
  'use strict';

  const Utils = require('swagger-boilerplate').Utils;
  const logger = new Utils.MultiLevelLogger('CharUtils', aLogLevel);
  const charWrapper = new(require('./chartWrapper'))(aLogLevel);

  const DEFAULT_COLOR_EVEN = 'rgba(255, 255, 255, 1)';
  const DEFAULT_COLOR_ODD = 'rgba(0, 0, 0, 1)';


  function notValidColor(color) {
    return isNaN(color) || color < 0 || color > 255;
  }

  function notValidAlpha(alpha) {
    return isNaN(alpha) || alpha < 0 || alpha > 1;
  }

  function getColors(value) {
    let colors = [];
    let strOfColors = value.split(',');
    for (let i = 0, l = strOfColors.length; i < l; i++) {
      let elem = strOfColors[i];
      let defaultColor = i % 2 ? DEFAULT_COLOR_ODD : DEFAULT_COLOR_EVEN;
      let aColor = [];
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

  function getValuesAsArray(aValue, aSep) {
    return aValue && aValue.split(aSep) || [];
  }

  function getChartOptions() {
    return {
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
  }

  return {
    getColors: getColors,
    rectifyArrayLength: rectifyArrayLength,
    getValuesAsArray: getValuesAsArray,
    getChartOptions: getChartOptions
  };
}

module.exports = ChartUtils;