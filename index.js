var koa = require('koa');
var app = koa();
var views = require('co-views');
var serve = require('koa-static');
var router = require('koa-router');

var moment = require('./lib/moment');
var db = require('./model/hatena');
var hatena = require('./lib/hatena');

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
    authentication: false
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

app.get('/pocket', function *() {

  if (yield db.isAuthenticate()) {
    this.body = 'you have been authentecated';
  } else {
    this.body = 'you have not been authentecated';
  }
  this.status = 200;

});

app.listen(3000);
