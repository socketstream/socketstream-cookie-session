'use strict';

module.exports = function(ss) {
  var api = {
    load: function() {
    },
    unload: function() {
    }
  };
  ss.session.setStrategy(api);
};
