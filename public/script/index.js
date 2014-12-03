var body = document.querySelector('body');
var hbs = document.querySelector('.main');
var comments = document.querySelector('.cmts');

// When hb items click, show article description.
hbs.addEventListener('click', function (e) {
  var el = e.target;
  if (el.classList.contains('hb__thumb')) {
    suspend(el);
  } else if (el.classList.contains('hb__count')) {
    showComment(el);
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
      var wrap = el.querySelector('.hb__wrap');

      clone.style.height = 'auto';
      wrap.insertBefore(clone, wrap.lastChild);

      hbBody.style.height = clone.clientHeight + 'px';
      hbBody.classList.add('active');

      wrap.removeChild(clone);
    }
  }
}

function suspend (el) {
  var title = el.parentNode.nextSibling.firstChild.textContent;
  var req = new XMLHttpRequest();
  req.open('GET', '/suspend', true);
  req.setRequestHeader('title', encodeURI(title));
  req.send();
}

// display bookmark comments
var close = document.querySelector('.cmts__close');

close.addEventListener('click', closeCmt);

function closeCmt (e) {
  var el = e.target;
  comments.removeChild(el.previousSibling);
}

function loadJS (src) {
  var script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
}

var positonTop;

function showComment (el) {
  var api = 'http://b.hatena.ne.jp/entry/jsonlite/?url=';

  while(!el.classList.contains('hb')) {
    el = el.parentNode;
  }
  positionTop = el.offsetTop;

  var url = el.querySelector('.hb__title').href;
  loadJS(api + encodeURI(url) + '&callback=entryCB');

  var wrap = document.querySelector('.wrap');
  if (wrap) {
    comments.removeChild(wrap);
  }
}

var entryCB = function(data){
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

