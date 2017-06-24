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
    return aValue && typeof aValue === 'string' && aValue.split(aSep) || [];
  }

  function getLegendPosition(aPosition) {
    if (LEGEND_POSITIONS_VALID.includes(aPosition)) {
      return aPosition;
    } else {
      return LEGEND_POSITION_DEFAULT;
    }
  }

  function validLegendValue(aValues) {
    let validateValue;
    let value = aValues[1];

    switch(aValues[0]) {
      case 'display':
        if (value.toLowerCase() === 'false') {
          validateValue = false;
        } else {
          validateValue = true;
        }
        break;
      case 'position':
        validateValue = getLegendPosition(value);
    }
    return validateValue;
  }

  function getLegendOptions(aLegend) {
    let legend = {};
    if (!aLegend) {
      return legend;
    }
    let legendKeysValues = getValuesAsArray(aLegend, ',');

    for (let i = 0, l = legendKeysValues.length; i < l; i++) {
      var values = getValuesAsArray(legendKeysValues[i], ':');
      if (values && values.length === 2 && LEGEND_VALID_KEYS.includes(values[0])) {
        legend[values[0]] = validLegendValue(values);
      }
    }
    return legend;
  }

  function getChartOptions(aLegends) {
    var legends = getLegendOptions(aLegends);

    let options = {
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
      },
      legend: legends
    };
    return options;
  }

  return {
    getColors: getColors,
    rectifyArrayLength: rectifyArrayLength,
    getValuesAsArray: getValuesAsArray,
    getChartOptions: getChartOptions
  };
}

module.exports = ChartUtils;