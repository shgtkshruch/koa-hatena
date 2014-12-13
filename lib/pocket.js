var config = require('../config.json');
var https = require('https');
var thunkify = require('thunkify');

module.exports = {

  getToken: function () {
    var body = {
      consumer_key: config.consumer_key,
      redirect_uri: 'localhost:3000/'
    };

    var options = {
      host: 'getpocket.com',
      path: '/v3/oauth/request',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Accept': 'application/json'
      }
    };

    var data = '';

    return thunkify(function (cb) {

      var req = https.request(options, function (res) {
        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on('end', function () {
          var token = JSON.parse(data).code;
          cb(null, token);
        });
      });

      req.on('error', function (e) {
        console.log('Problem with request: ' + e.message);
      });

      req.write(JSON.stringify(body));
      req.end();
    })();
  }
};
