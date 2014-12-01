var monk = require('monk');
var wrap = require('co-monk');

var db = monk('localhost/hatena');
var bookmarks = wrap(db.get('bookmarks'));

module.exports = {

  save: function *(hbs) {

    yield bookmarks.remove({});

    yield bookmarks.insert(hbs);

    var res = yield bookmarks.find({});
    console.log(res);

    db.close();
  }

};

