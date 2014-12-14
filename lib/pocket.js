var config = require('../config.json');
var db = require('../model/hatena');
var https = require('https');
var thunkify = require('thunkify');

var options = {
  host: 'getpocket.com',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Accept': 'application/json'
  }
};

var redirect_uri = 'pocketapp1234:authorizationFinished';

function request (path, body) {
  options.path = path;

  return thunkify(function (cb) {
    var data = '';
    var req = https.request(options, function (res) {
      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        cb(null, JSON.parse(data));
      });
    });

    req.on('error', function (e) {
      console.log('Problem with request: ' + e.message);
    });

    if (body) {
      req.write(body);
    }

    req.end();
  })();
}

module.exports = {

  requestToken: function *() {
    var body = {
      consumer_key: config.consumer_key,
      redirect_uri: redirect_uri
    };

    var res = yield request('/v3/oauth/request', JSON.stringify(body));

    return res.code;
  },

  authenticationPageUrl: function (requestToken) {
    return 'https://' + options.host +  '/auth/authorize' +
      '?request_token=' + requestToken + '&redirect_uri=' + redirect_uri;
  },

  accessToken: function *(requestToken) {
    var body = {
      consumer_key: config.consumer_key,
      code: requestToken
    };

    var res = yield request('/v3/oauth/authorize', JSON.stringify(body));

    return res.access_token;
  },

  save: function *(url) {
    var body = {
      url: url,
      tags: 'hatenabookmark',
      consumer_key: config.consumer_key,
      access_token: yield db.pocket.accessToken()
    };
    var res = yield request('/v3/add', JSON.stringify(body));
    return res.status === 1 ? 200 : 500;
  }
};
