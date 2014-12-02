var thunkify = require('thunkify');
var MongoClient = require('mongodb').MongoClient;
var dbName = 'bookmarks';

var connect = thunkify(function (cb) {
  MongoClient.connect('mongodb://localhost:27017/hatena', function (err, db) { 
    cb(err, db);
  });
});

var insert = thunkify(function (db, data, cb) {
  db.collection(dbName).insert(data, function (err, res) {
    cb(err, res);
  });
});

var find = thunkify(function (db, cb) {
  db.collection(dbName).find({}).sort({date: -1}).toArray(function (err, docs) {
    cb(err, docs);
  });
});

var remove = thunkify(function (db, cb) {
  db.collection(dbName).remove({}, function (err, res) {
    cb(err, res);
  });
});

var count = thunkify(function (db, cb) {
  db.collection(dbName).count(function (err, res) {
    cb(err, res);
  });
});

module.exports = {
  save: function *(hbs) {
    var db = yield connect();

    yield remove(db);

    yield insert(db, hbs);

    db.close();
  },

  find: function *() {
    var db = yield connect();

    var res = yield find(db);

    db.close();

    return res;
  }
};

