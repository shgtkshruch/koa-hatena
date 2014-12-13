module.exports = function (el) {
  while(!el.classList.contains('hb')) {
    el = el.parentNode;
  }
  var req = new XMLHttpRequest();
  req.open('DELETE', '/bookmark', true);
  req.setRequestHeader('id', el.dataset.id);
  req.send();
};
