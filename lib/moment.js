var moment = require('moment');

moment.locale('jp', {
  relativeTime: {
    past: '%s',
    s: '秒',
    m: '分',
    mm: '%d分',
    h: '1時間',
    hh: '%d時間',
    d: '1日',
    dd: '%d日'
  }
});

module.exports = {

  /**
   * @param object
   * @return string
   *
   * example
   * var hatena = {
   *   time: '2014-10-23T23:38:18+09:00',
   *   format: 'YYYY-MM-DD HH:mm:ss Z'
   * }
   * var twitter = {
   *   time: 'Oct 23 22:21:34 +0000 2014', 
   *   format: 'MMM DD HH:mm:ss Z'
   * }
   *
   */

  format: function (date) {
    return moment(date.time, date.format).format('x');
  },

  /**
   * @param {String} taeget time
   * @return {String} time from now
   *
   * example
   * formatNow(1417478493236) => 1日
   * 
   */

  fromNow: function (time) {
    return  moment(parseInt(time, 10)).fromNow();
  }
};

