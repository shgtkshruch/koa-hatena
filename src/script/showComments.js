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
  var wrap = document.createElement('div');

  wrap.classList.add('cmts__wrap');
  wrap.innerHTML = Handlebars.templates['comment.hbs'](data.bookmarks);

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



  var wrap = document.querySelector('.cmts__wrap');
  if (wrap) {
    comments.removeChild(wrap);
  }
};
