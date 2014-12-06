var mongo = require('../model/hatena');
var co = require('co');
var request = require('cogent');
var cheerio = require('cheerio');
var moment = require('./moment');

var api = 'http://b.hatena.ne.jp/sh19e/favorite.rss?of=';

module.exports = function *(target) {

  return co(function *() {
    var newer = true;
    var n = 0;
    var i = 0;
    var itemPerPage = 25;
    var dbNewest = yield mongo.newest();

    // if database has data, use it.
    // until use date from date that user specified with form.
    dbNewest = dbNewest.length !== 0 ? dbNewest[0].date : target;

    while (newer) {

      var url = api + (i++ * itemPerPage);
      console.log(url);

      var hbs = [];
      var res = yield request(url, {string: true});
      var $ = cheerio.load(res.text, {
        xmlMode: true
      });

      $('item').each(function (i, el) {
        var hb = {};
        var $this = $(this);

        var date = $(this).find('dc\\:date').text();
        date = moment.format({time: date, format: 'YYYY-MM-DDTHH:mm:ssZ'});
        date = parseInt(date, 10);

        if (date <= dbNewest) {
          newer = false;
          return;
        }

        hb.date = date;
        hb.title = $this.find('title').text();
        hb.link = $(this).find('link').text();
        hb.description = $(this).find('description').text();
        hb.creator = $(this).find('dc\\:creator').text();
        hb.hatenaBookmarkCount = $(this).find('hatena\\:bookmarkcount').text();

        // article body
        var body = $(this).find('content\\:encoded').text();
        var p = $('cite + p + p', body).text();
        p = p === ' ' ? $('cite + p', body).text() : p;
        hb.body = p;

        hbs.push(hb);
      });
      n += hbs.length;

      // save bookmarks to database;
      yield mongo.save(hbs);
    }
    return {num: n};
  });
};
