!function(exports) {

  var inputSectionElem;
  var resultSectionElem;

  var chartTypeSelect;
  var btnSend;
  var divParams;
  var sharedSecretInput;

  var jsonResultInput;
  var urlResultInput;
  var chartImg;

  const HOST = document.location.origin;

  const URLS = {
    'line': HOST + '/charts/line',
    'bar': HOST + '/charts/bar',
    'pie': HOST + '/charts/pie',
    'polarArea': HOST + '/charts/polarArea',
    'doughnut': HOST + '/charts/doughnut'
  };

  var initHTMLElements = function initHTMLElements() {
    inputSectionElem = document.getElementById('inputs');
    chartTypeSelect = inputSectionElem.querySelector('#chartType');
    btnSend = inputSectionElem.querySelector('#sendParams');
    divParams = inputSectionElem.querySelectorAll('div.chartInputs');
    sharedSecretInput = inputSectionElem.querySelector('#sharedSecret');
    resultSectionElem = document.getElementById('result');
    jsonResultInput = resultSectionElem.querySelector('#jsonResult');
    urlResultInput = resultSectionElem.querySelector('#urlResult');
    chartImg = resultSectionElem.querySelector('#chartImg');

    chartTypeSelect.value = 'line';
    onSelectChange({target:{value:'line'}});
  };

  var setResultsVisibility = function setResultsVisibility(visible) {
    resultSectionElem.dataset.status = visible ? 'visible' : 'hidden';
  };

  var onInputChange = function onInputChange(evt) {
    setResultsVisibility(false);
  };

  var onSelectChange = function onSelectChange(evt) {
    setResultsVisibility(false);

    if (!evt.target.value) {
      return;
    }
    var chartType = evt.target.value;

    for (var i = 0, l = divParams.length; i < l; i++) {
      var domNode = divParams[i];
      domNode.style.display = domNode.id === chartType ? 'inline' : 'none';
    }
  };

  var getInputValues = function getInputValues(domElems) {
    var result = {};
    for (var i = 0, l = domElems.length; i < l; i++) {
      var elem = domElems[i];
      var name = elem.name;
      if (name === 'sharedSecret') {
        continue;
      }
      var value = elem.value;
      if (value !== '') {
        if (elem.class === 'json') {
          result[name] = JSON.parse(value);
        } else {
          result[name] = value;
        }
      }
    }
    return result;
  };

  var composeJSON = function composeJSON(chartType) {
    var genericFieldsDOM = inputSectionElem.querySelectorAll('div#genericParameters input');
    var genericValues = getInputValues(genericFieldsDOM);

    var inputsFieldsDOM = inputSectionElem.querySelectorAll('div#' + chartType + ' input');
    var especificValues = getInputValues(inputsFieldsDOM);

    return Object.assign({}, genericValues, especificValues);
  };

  var loadImg = function loadImg() {
    var params = composeJSON(chartTypeSelect.value);
    var sharedSecret = sharedSecretInput.value;

    var paramsStringified = JSON.stringify(params);
    jsonResultInput.value = paramsStringified;
    setResultsVisibility(true);

    var encodedParams = btoa(paramsStringified);

    if (sharedSecret) {
      var auth = cryptoUtils.then(cu => cu.doImportKey(cu.str2bin(sharedSecret)).
        then(cu.doHMAC.bind(cu, cu.str2bin(encodedParams))).
        then(cu.bin2hex).
        then(function(auth) {
          let src = URLS[chartTypeSelect.value] + '?param=' + encodedParams + '&auth=' + auth;
          chartImg.src = src;
          urlResultInput.value = src;
          return src;
        }));
    } else {
      let src = URLS[chartTypeSelect.value] + '?param=' + encodedParams;
      urlResultInput.value = src;
      chartImg.src = src;
    }
  };

  var addHandlers = function addHandlers() {
    var setHandler = function setHandle(arrElem, handler) {
      for (var i = 0, l = arrElem.length; i < l; i++) {
        var elem = arrElem[i];
        elem.addEventListener('keyup', handler);
      }
    };

    chartTypeSelect.addEventListener('change', onSelectChange);
    btnSend.addEventListener('click', loadImg);

    var genericFieldsDOM = inputSectionElem.querySelectorAll('div#genericParameters input');
    setHandler(genericFieldsDOM, onInputChange);

    var chartTypes = Object.keys(URLS);
    for (var i = 0, l = chartTypes.length; i < l; i++) {
      var inputsFieldsDOM = inputSectionElem.querySelectorAll('div#' + chartTypes[i] + ' input');
      setHandler(inputsFieldsDOM, onInputChange);
    }
  };

  var init = function init() {
    initHTMLElements();
    addHandlers();
  };

  init();
}(this);
