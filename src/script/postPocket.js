module.exports = function (el) {
  var req = new XMLHttpRequest();
  req.open('POST', '/pocket', true);
  req.onreadystatechange = function (e) {
    if (this.status === 200 && this.readyState === 4) {
      console.log(this.response);
    }
  };
  req.setRequestHeader('url', el.dataset.url);
  req.send();
};
