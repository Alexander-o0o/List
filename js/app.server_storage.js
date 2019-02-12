(function() {
  const ServerStorage = function() {};
  ServerStorage.prototype.read = function(onRead) {
    // this._xhrMessage('GET', 'http://localhost/my-sites/load_data.php', onRead);
    this._xhrMessage('GET', 'https://alexander-o0o.github.io/List/data.json', onRead);
    // this._xhrMessage('GET', 'data.json', onRead);
  };
  ServerStorage.prototype._xhrMessage = function(
      httpMethod, url, onLoad, data, responseType) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = responseType || 'text';
    xhr.addEventListener('load', function(event) {
      onLoad(JSON.parse(event.target.responseText));
    });
    xhr.open(httpMethod, url);
    if (data !== undefined) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.ServerStorage = ServerStorage;
}());
