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
  this.body = yield render('index');
});

app.get('/bookmark', function *() {
  var hbs = yield db.find({});

  hbs.forEach(function (hb) {
    hb.date = moment.fromNow(hb.date);
  });

  this.body = hbs;
});

app.get('/suspend', function *() {
  var title = decodeURI(this.get('title'));
  yield db.remove(title);
  this.body = 200;
});

app.get('/reload', function *() {
  var newest = yield db.newest();
  var n = yield hatena(newest[0].date);
  this.body = 'Add ' + n + 'bookmarks';
});

app.listen(3000);
