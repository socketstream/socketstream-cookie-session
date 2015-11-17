var transportConfig = {};

exports.setTransportConfig = function(config) {
    transportConfig = config;
};

exports.getSessionToken = function() {
    var cookieName = transportConfig.cookieName || 'connect.sid';
    if (localStorage.session_token) {
      return localStorage.session_token;
    } else {
      var token = getCookie(cookieName);
      if (transportConfig.localStorage) {
        localStorage.session_token = token;
      }
      return token;
    }
};

Object.defineProperty(exports,'sessionToken', {
    get: exports.getSessionToken
});

function getCookie(c_name) {
  var c_end, c_start;
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + '=');
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(';', c_start);
      if (c_end === -1) { c_end = document.cookie.length; }
      return decodeURIComponent(document.cookie.substring(c_start, c_end));
    }
  }
  return '';
}
