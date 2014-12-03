module.exports = function (el) {
  var title = el.parentNode.nextSibling.firstChild.textContent;
  var req = new XMLHttpRequest();
  req.open('GET', '/suspend', true);
  req.setRequestHeader('title', encodeURI(title));
  req.send();
};
