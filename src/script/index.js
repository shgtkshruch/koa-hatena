var hbs = document.querySelector('.main');

hbs.addEventListener('click', function (e) {
  var el = e.target;
  if (el.classList.contains('hb__thumb')) {
    require('./suspend')(el);
  } else if (el.classList.contains('hb__count')) {
    require('./showComments')(el);
  } else {
    require('./showDescription')(el);
  }
});

require('./closeComment')();
