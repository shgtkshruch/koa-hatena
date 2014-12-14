var koa = require('koa');
var app = koa();
var views = require('co-views');
var serve = require('koa-static');
var router = require('koa-router');

var moment = require('./lib/moment');
var db = require('./model/hatena');
var hatena = require('./lib/hatena');
var pocket = require('./lib/pocket');

var render = views('views', {
  ext: 'jade'
});

app.use(router(app));

app.use(serve('public'));

app.get('/', function *() {
  var newest = yield db.newest();
  this.body = yield render('index', {
    now: moment.now(),
    db: newest.length === 1,
    isAuthentication: yield db.pocket.isAuthenticate()
  });
});

app.get('/bookmark', function *() {
  var hbs = yield db.find(this.get('id') || null);

  hbs.forEach(function (hb) {
    hb.date = moment.fromNow(hb.date);
  });

  this.body = hbs;
});

app.del('/bookmark', function *() {
  yield db.remove(this.get('id'));
  this.body = 200;
});

app.post('/bookmark', function *() {
  yield hatena(this.get('unixTime'));
  this.body = 200;
});

var requestToken;

app.get('/pocket/request_token', function *() {
  if (yield db.isAuthenticate()) {
    this.body = 'you have been authentecated';
  } else {
    requestToken = yield pocket.requestToken();
    this.body = pocket.authenticationPageUrl(requestToken);
  }
});

app.get('/pocket/access_token', function *() {
  var obj = {
    name: 'pocket',
    accessToken: yield pocket.accessToken(requestToken)
  };
  yield db.pocket.save(obj);
  this.body = 200;
});

app.post('/pocket', function *() {
  this.status = yield pocket.save(this.get('url'));

  switch (this.status) {
    case 200:
      this.body = 'Save item to pocket';
      break;
    case 500:
      this.body = 'Faled to save item to pocket';
      break;
  }
});

app.listen(3000);
