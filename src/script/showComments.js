window.browserify = {};

var api = 'http://b.hatena.ne.jp/entry/jsonlite/?url=';
var comments = document.querySelector('.cmts');
var positonTop;

function loadJS (src) {
  var script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
}

window.browserify.entryCB = function(data){
  var count = data.count;
  var wrap = document.createElement('div');
  wrap.classList.add('wrap');

  data.bookmarks.forEach(function (hb) {
    if (!hb.comment) return;

    var hbc = document.createElement('div');
    hbc.classList.add('hbc');
    var hbc__meta = document.createElement('ul');
    hbc__meta.classList.add('hbc__meta');

    function appendEl (parent, el, name) {
      if (!hb[name]) return;

      var node = document.createElement(el);
      node.textContent = hb[name];
      node.classList.add(name);
      parent.appendChild(node);
    }

    appendEl(hbc__meta, 'li', 'user');
    appendEl(hbc__meta, 'li', 'timestamp');
    hbc.appendChild(hbc__meta);

    appendEl(hbc, 'p', 'comment');
    wrap.appendChild(hbc);
  });

  comments.insertBefore(wrap, comments.firstChild);
  comments.style.top = positionTop + 'px';
};

module.exports = function (el) {

  while(!el.classList.contains('hb')) {
    el = el.parentNode;
  }
  positionTop = el.offsetTop;

  var url = el.querySelector('.hb__title').href;
  loadJS(api + encodeURI(url) + '&callback=window.browserify.entryCB');



  var wrap = document.querySelector('.wrap');
  if (wrap) {
    comments.removeChild(wrap);
  }
};
