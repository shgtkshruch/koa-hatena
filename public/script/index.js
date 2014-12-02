var body = document.querySelector('body');
var hbs = document.querySelector('.main');

// When hb items click, show article description.
hbs.addEventListener('click', function (e) {
  var el = e.target;
  if (el.classList.contains('hb__count')) {
    suspend(el);
  } else {
    showDescription(el);
  }
});

function showDescription (el) {

  while(!el.classList.contains('hb')) {
    el = el.parentNode;
  }

  var hbBody = el.querySelector('.hb__body');

  if (hbBody) {

    if (hbBody.classList.contains('active')) {

      hbBody.style.height = 0;
      hbBody.classList.remove('active');

    } else {

      // Clone node to calculate height.
      var clone = hbBody.cloneNode(true);

      clone.style.height = 'auto';

      hbs.insertBefore(clone, hbs.lastChild);

      hbBody.style.height = clone.clientHeight + 'px';
      hbBody.classList.add('active');

      hbs.removeChild(clone);
    }
  }
}

function suspend (el) {
  var title = el.parentNode.nextSibling.textContent;
  var req = new XMLHttpRequest();
  req.open('GET', '/suspend', true);
  req.setRequestHeader('title', encodeURI(title));
  req.send();
}
