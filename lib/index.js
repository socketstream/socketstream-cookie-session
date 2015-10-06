'use strict';

module.exports = function(ss) {
  var expressSession = require('./express-session')(ss.session),
      cookieParser = require('cookie-parser'),
      qs = require('querystring'), 
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

    /**
     * @param request The request associated with the Web Socket
     * @returns Session ID or null
     */
    extractSocketSessionId: function(request, options) {
      try {
        var cookie_obj = qs.parse(request.headers.cookie, ';');
        // for reasons mysterious the connect.sid key sometimes comes with 1 leading whitespace
        var cursor = cookie_obj['connect.sid'] ? cookie_obj['connect.sid'] : cookie_obj[' connect.sid'];
        return cookieParser.signedCookie(cursor, options.secret);
      }
      catch(e) {
        log.warn('Warning: connect.sid session cookie not detected. User may have cookies disabled or session cookie has expired');
        return false;
      }
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
