var koa = require('koa');
var app = koa();
var views = require('co-views');
var serve = require('koa-static');
var stylus = require('koa-stylus');
var router = require('koa-router');

var hatena = require('./model/hatena');

var render = views('views', {
  ext: 'jade'
});

app.use(router(app));

app.use(stylus('public'));

app.use(serve('public'));

app.get('/', function *() {
  var hbs = yield hatena.find();
  this.body = yield render('index', {hbs: hbs});
});

app.listen(3000);
