// display bookmark comments

module.exports = function () {
  var comments = document.querySelector('.cmts');
  var close = document.querySelector('.cmts__close');

  close.addEventListener('click', closeCmt);

  function closeCmt (e) {
    var el = e.target;
    comments.removeChild(el.previousSibling);
  }
};
