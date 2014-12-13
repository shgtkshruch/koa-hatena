function request (path, cb) {
  var req = new XMLHttpRequest();
  req.open('GET', path, true);
  req.onreadystatechange = function (e) {
    if (this.status === 200 && this.readyState === 4) {
      cb(this);
    }
  };
  req.send();
}

module.exports = function () {

  var haveNoteToken = true;
  var btn = document.getElementById('js-request');
  var a;

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      if (haveNoteToken) {
        request('pocket/request_token', function (response) {

          btn.textContent = 'Get Access Token';
          btn.style.display = 'none';

          a = document.createElement('a');
          a.classList.add('pocket__btn');
          a.href = response.response;
          a.textContent = 'Open New Tab';
          a.target = '_blank';
          a.addEventListener('click', function (e) {
            haveNoteToken = false;
            a.style.display = 'none';
            btn.style.display = 'table-cell';
          });

          btn.parentNode.appendChild(a);
        });

      } else {
        request('pocket/access_token', function (response) {
          console.log(response.status);
        });
      }
    });
  }
};
