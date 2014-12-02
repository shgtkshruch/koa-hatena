var koa = require('koa');
var app = koa();
var views = require('co-views');
var serve = require('koa-static');
var stylus = require('koa-stylus');
var router = require('koa-router');

var moment = require('./lib/moment');
var db = require('./model/hatena');
var hatena = require('./lib/hatena');

var render = views('views', {
  ext: 'jade'
});

app.use(router(app));

app.use(stylus('public'));

app.use(serve('public'));

app.get('/', function *() {
  var hbs = yield db.find({});

  hbs.forEach(function (hb) {
    hb.date = moment.fromNow(hb.date);
  });

  this.body = yield render('index', {hbs: hbs});
});

app.get('/suspend', function *() {
  var title = decodeURI(this.get('title'));
  yield db.remove(title);
  this.body = 200;
});

app.get('/reload', function *() {
  var newest = yield db.newest();
  // var newest = 1417507368000;//yield db.newest();
  yield hatena(newest[0].date);
});

app.listen(3000);
