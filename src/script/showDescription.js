module.exports = function (el) {

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
      var wrap = el.querySelector('.hb__wrap');

      clone.style.height = 'auto';
      wrap.insertBefore(clone, wrap.lastChild);

      hbBody.style.height = clone.clientHeight + 'px';
      hbBody.classList.add('active');

      wrap.removeChild(clone);
    }
  }
};
