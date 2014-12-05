module.exports = function () {
  var form = document.querySelector('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var date = this[0].valueAsNumber - 9 * 60 * 60 * 1000;
    var req = new XMLHttpRequest();
    req.open('POST', '/bookmark', true);
    req.setRequestHeader('unixTime', date);
    req.send();
  });
};
