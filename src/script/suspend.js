module.exports = function (el) {
  while(!el.classList.contains('hb')) {
    el = el.parentNode;
  }
  var title = el.querySelector('.hb__title').textContent;
  var req = new XMLHttpRequest();
  req.open('GET', '/suspend', true);
  req.setRequestHeader('title', encodeURI(title));
  req.send();
};
