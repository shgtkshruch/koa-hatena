var _ = require('lodash');

module.exports = function () {
  var main = document.querySelector('.main');
  var bottom = 0;

  main.addEventListener('render', function (e) {
    bottom = main.offsetTop + main.offsetHeight;
  });

  window.addEventListener('scroll', _.throttle(scroll, 3000));

  function scroll (e) {
    var y = window.scrollY;

    if (bottom - 1500 < y) {
      insertNewBookmark();
    }
  }

  function insertNewBookmark () {
    var id = main.lastElementChild.dataset.id;
    request(id);
  }

  function request (id) {
    var req = new XMLHttpRequest();
    req.open('GET', '/bookmark', true);
    req.onreadystatechange = function (e) {
      if (this.status === 200 && this.readyState === 4) {
        var data = JSON.parse(this.responseText);

        if (data.length === 0) {
          console.log('All bookmarks have been read.');
          return;
        } 

        var res = Handlebars.templates['bookmark.hbs'](data);
        main.innerHTML += res;
        var event = new Event('render');
        main.dispatchEvent(event);
      }
    };
    req.setRequestHeader('id', id);
    req.send();
  }

};
