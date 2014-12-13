var render = require('./renderingHandlebars');
var Steady = require('steady');

module.exports = function () {
  var main = document.querySelector('.main');
  var bottom = 0;

  main.addEventListener('render', function (e) {
    bottom = main.offsetTop + main.offsetHeight;
  });

  new Steady({
    conditions: {
      "max-bottom": 1000
    },
    throttle: 200,
    handler: scroll
  });

  function scroll (values, done) {
    var id = main.lastElementChild.dataset.id;
    render(id);
    done();
  }
};
