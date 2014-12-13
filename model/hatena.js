var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/hatena');

var bookmarks = wrap(db.get('bookmarks'));
var pocket = wrap(db.get('pocket'));

module.exports = {
  save: function *(hbs) {
    yield bookmarks.insert(hbs);
  },

  find: function *(id) {
    var res;

    if (id) {
      var haveRead = yield bookmarks.find({ _id: id });
      res = yield bookmarks.find(
          { date: { $gt: haveRead[0].date } },
          { limit: 25, sort: { date: 1 } }
      );
    } else {
      res = yield bookmarks.find(
          {},
          { limit: 25, sort: { date: 1 } }
      );
    }

    return res;
  },

  newest: function *() {
    return yield bookmarks.find(
        {},
        {limit: 1, sort: { date: -1 } }
    );
  },

  remove: function *(id) {
    var delTarget = yield bookmarks.find({ _id: id });

    yield bookmarks.remove(
        { date: { $lte: delTarget[0].date } }
    );
  },

  pocketSave: function *(accessToken) {
    yield pocket.insert(accessToken);
  },

  isAuthenticate: function *() {
    var res = yield pocket.find({ name: 'pocket' });
    return res.length === 1 ? true : false;
  }
};

