var thunkify = require('thunkify');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var dbName = 'bookmarks';

var connect = thunkify(function (cb) {
  MongoClient.connect('mongodb://localhost:27017/hatena', function (err, db) { 
    cb(err, db);
  });
});

var insert = thunkify(function (db, data, cb) {
  db.collection(dbName)
    .insert(data, function (err, res) {
    cb(err, res);
  });
});

var find = thunkify(function (db, query, cb) {
  db.collection(dbName)
    .find(query)
    .sort({date: 1})
    .limit(25)
    .toArray(function (err, docs) {
    cb(err, docs);
  });
});

var newest = thunkify(function (db, cb) {
  db.collection(dbName)
    .find({}, {title: 1, date: 1})
    .sort({date: -1})
    .limit(1)
    .toArray(function (err, docs) {
    cb(err, docs);
  });
});

var remove = thunkify(function (db, query, cb) {
  db.collection(dbName)
    .remove(query, function (err, res) {
    cb(err, res);
  });
});

var count = thunkify(function (db, cb) {
  db.collection(dbName)
    .count({}, function (err, res) {
    cb(err, res);
  });
});

module.exports = {
  save: function *(hbs) {
    var db = yield connect();

    // yield remove(db, {});

    yield insert(db, hbs);

    db.close();
  },

  find: function *(id) {
    var query = {};
    var db = yield connect();

    if (id) {
      var haveRead = yield find(db, {_id: new ObjectId(id)});
      query = {date: {$gt: haveRead[0].date }};
    }

    var res = yield find(db, query);

    db.close();

    return res;
  },

  newest: function *() {
    var db = yield connect();

    var res = yield newest(db);
    db.close();

    return res;
  },

  remove: function *(id) {
    var db = yield connect();

    var res = yield find(db, {_id: new ObjectId(id)});

    if (res.length !== 0) {
      yield remove(db, {date: {$lte: res[0].date}});
    }

    db.close();
  }
};

