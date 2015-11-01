'use strict';

module.exports = function(ss) {
  var expressSession = require('./express-session')(ss.session),
      cookieParser = require('cookie-parser'),
      qs = require('querystring'),
      debug = require('debug')('socketstream:session'),
      sessionMiddleware;

  var strategy = {
    get sessionMiddleware() {
      return sessionMiddleware || (sessionMiddleware = makeMiddleware());
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
        //TODO if didn't decode cookie, make new one?
        // http://stackoverflow.com/questions/3240246/signed-session-cookies-a-good-idea
        return cookieParser.signedCookie(cursor, options.secret || ss.session.options.secret);
      }
      catch(e) {
        log.warn('Warning: connect.sid session cookie not detected. User may have cookies disabled or session cookie has expired');
        return false;
      }
    },

    create: create,

    load: function() {
      debug('loaded.');
    },
    unload: function() {
      debug('unloaded.');
    }
  };
  ss.session.setStrategy(strategy);

  function create(sessionId) {
    var session = new ss.session.Session({
      sessionID: sessionId,
      sessionStore: ss.session.store.get()
    });
    session.cookie = {
      path: '/',
      httpOnly: ss.session.options.httpOnly || false,
      maxAge: ss.session.options.maxAge,

      // For HTTPS the cookie must be secure #349
      secure: ss.http.settings.secure || ss.session.options.secure
    };
    session.save();
    debug('Creating cookie for session %s',sessionId);
    return session;
  }

  if (ss.http.settings.secure && ss.session.options.secret === 'SocketStream') {
    ss.log.warn('Session Cookie must be set\n    ss.session.options.secret = "Your secret passphrase";');
  }

  function makeMiddleware() {
    var cookie = {
      path: '/',
      httpOnly: ss.session.options.httpOnly || false,
      maxAge: ss.session.options.maxAge,
      secure: ss.http.settings.secure || ss.session.options.secure
    };
    //TODO config point for ss.session.options.cookie
    // if (settings.strategy.sessionCookie) {
    //   for(var k in settings.strategy.sessionCookie) {
    //     cookie[k] = settings.strategy.sessionCookie[k];
    //   }
    // }
    debug('Created session middleware.');
    return expressSession({
      cookie: cookie,
      store: ss.session.store.get(),
      secret: ss.session.options.secret,
      resave: false,
      saveUninitialized: true
    });
  }
};
