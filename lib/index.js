'use strict';

module.exports = function(ss) {
  var expressSession = ss.require('express-session'),
      sessionMiddleware;

  var api = {
    get sessionMiddleware() {
      if (!sessionMiddleware) {
        var cookie = {
          path: '/',
          httpOnly: false,
          maxAge: ss.session.options.maxAge,
          secure: ss.http.settings.secure
        };
        // if (settings.strategy.sessionCookie) {
        //   for(var k in settings.strategy.sessionCookie) {
        //     cookie[k] = settings.strategy.sessionCookie[k];
        //   }
        // }
        sessionMiddleware = expressSession({
          cookie: cookie,
          // store: sessionStore, TODO ss.session.store
          secret: ss.session.options.secret,
          resave: false,
          saveUninitialized: true
        });
      }
      //TODO [cookieParser,session]
      return sessionMiddleware;
    },

    //TODO store?
    
    load: function() {
    },
    unload: function() {
    }
  };
  ss.session.setStrategy(api);
};
