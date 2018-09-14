module.exports = function(aLogLevel) {
  'use strict';

  var reqNum = 0;

  const RESP_OK = '{"total":0,"results":[]}';
  const RESP_WRONG = 'Service Temporarily Unavailable https://api.es-pro.movistar-home.com/api/v1/users?phone=%2B34000000000';

  function getUsers(aReq, aRes) {
    if ((reqNum++) % 2 === 0) {
      aRes.status(503).send(RESP_WRONG);
    } else {
      aRes.status(200).send(RESP_OK);
    }
  }

  return {
    getUserMovistarHome: getUsers
  };

}