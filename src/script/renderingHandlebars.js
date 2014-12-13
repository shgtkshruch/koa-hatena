module.exports = function (newestId) {
  var main = document.querySelector('.main');
  var req = new XMLHttpRequest();

  req.open('GET', '/bookmark', true);
  req.onreadystatechange = function (e) {
    if (this.status === 200 && this.readyState === 4) {
      var data = JSON.parse(this.responseText);

      if (data.length === 0) {
        console.log('All bookmarks have been read.');
        return;
      } 

      // rendering bookmarks
      var res = Handlebars.templates['bookmark.hbs'](data);
      main.innerHTML += res;

      // dispatch render event for notify render is done
      // to calculate window bottom position.
      var event = new Event('render');
      main.dispatchEvent(event);
    }
  };
  req.setRequestHeader('id', newestId ? newestId : '');
  req.send();
};
