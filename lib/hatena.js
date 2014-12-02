var mongo = require('../model/hatena');
var co = require('co');
var request = require('cogent');
var cheerio = require('cheerio');
var moment = require('./moment');

var url = 'http://b.hatena.ne.jp/sh19e/favorite.rss';

co(function *() {
  var hbs = [];
  var res = yield request(url, {string: true});
  var $ = cheerio.load(res.text, {
    xmlMode: true
  });

  $('item').each(function (i, el) {
    var hb = {};
    var $this = $(this);

    hb.title = $this.find('title').text();
    hb.link = $(this).find('link').text();
    hb.description = $(this).find('description').text();
    hb.creator = $(this).find('dc\\:creator').text();
    var date = $(this).find('dc\\:date').text();
    hb.date = moment.format({time: date, format: 'YYYY-MM-DD HH:mm:ss Z'});
    hb.hatenaBookmarkCount = $(this).find('hatena\\:bookmarkcount').text();

    // article body
    var body = $(this).find('content\\:encoded').text();
    var p = $('cite + p + p', body).text();
    p = p === ' ' ? $('cite + p', body).text() : p;
    hb.body = p;

    hbs.push(hb);
  });

  // save bookmarks to database;
  yield mongo.save(hbs);

});

