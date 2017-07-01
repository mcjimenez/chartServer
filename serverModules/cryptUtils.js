function CryptUtils() {
  'use strict';

  var crypto = require('crypto');
  const HASH_ALG = 'sha256';

  function getAuthToken(data, secret) {
    var hmac = crypto.createHmac(HASH_ALG, secret);
    hmac.update(data);
    return hmac.digest().hexSlice();
  }

  function cryptPasswd(aPasswd) {
    var h = crypto.createHash(HASH_ALG);
    h.update(aPasswd); // To-Do: Salt?
    return h.digest('base64');
  }

  function checkPasswd(aClearText, aCiphered) {
    var cipheredCT = aClearText && cryptPasswd(aClearText);
    return cipheredCT && cipheredCT === aCiphered;
  }

  // Note: I know this is as secure as just posting the number all over the web. Again, it's here
  // for convenience only. It should be part of the parent app.
  function getRandomPIN(aLength) {
    var pin = Math.floor(Math.pow(10, aLength) * Math.random()) + "";
    while (pin.length < aLength) { pin = '0' + pin; }
    return pin;
  }

  return {
    cryptPasswd: cryptPasswd,
    checkPasswd: checkPasswd,
    getRandomPIN: getRandomPIN,
    getAuthToken: getAuthToken
  };

}

module.exports = CryptUtils();
