'use strict';

module.exports = function(ss) {
  var expressSession = require('./express-session')(ss.session),
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
          store: ss.session.store.get(),
          secret: ss.session.options.secret,
          resave: false,
          saveUninitialized: true
        });
      }
      //TODO [cookieParser,session]
      return sessionMiddleware;
    },

    create: create,

    //TODO store?
    
    load: function() {
    },
    unload: function() {
    }
  };
  ss.session.setStrategy(api);

  function create(sessionId) {
    var session;
    session = new expressSession.Session({
      sessionID: sessionId,
      sessionStore: sessionStore
    });
    session.cookie = {
      maxAge: ss.session.options.maxAge
    };
    session.save();
    return session;
  }

};
