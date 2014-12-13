module.exports = function () {
  var btn = document.querySelector('.pocket__btn');
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    var req = new XMLHttpRequest();
    req.open('GET', '/pocket', true);
    req.onreadystatechange = function (e) {
      if (this.status === 200 && this.readyState === 4) {
        console.log(this.response);
        var redirect_url = this.response;
        // window.open(redirect_url);
      }
    };
    req.send();
  });
};
