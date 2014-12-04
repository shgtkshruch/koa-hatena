module.exports = function (el) {
  while(!el.classList.contains('hb')) {
    el = el.parentNode;
  }
  console.log(el.dataset.id);
  return;
  var req = new XMLHttpRequest();
  req.open('GET', '/suspend', true);
  req.setRequestHeader('id', el.dataset.id);
  req.send();
};
