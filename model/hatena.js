var monk = require('monk');
var wrap = require('co-monk');
var db, bookmarks;


function connect () {
  db = monk('localhost/hatena');
  bookmarks = wrap(db.get('bookmarks'));
}

module.exports = {

  save: function *(hbs) {
    connect();

    yield bookmarks.remove({});

    yield bookmarks.insert(hbs);

    var res = yield bookmarks.find({});
    console.log(res);

    db.close();
  },

  find: function *(hbs) {
    connect();

    var res = yield bookmarks.find({});

    db.close();

    return res;
  }

};

