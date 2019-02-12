(function() {
  const Storage = function(clientStorage, serverStorage) {
    this._clientStorage = clientStorage;
    this._serverStorage = serverStorage;
    this._clientStorage.init();
    const ClientStorage = window.list_app.ClientStorage;
    Storage.pathDelimiter = ClientStorage.path.delimiter;
  };
  Storage.saveModes = {
    replace: 0,
    add: 1,
  };
  Storage.prototype.findChild = function(path, grandchild, data, onFind) {
    this._clientStorage.findChild(path, grandchild, data, onFind);
  };
  Storage.prototype.save = function(path, data, mode, onWrite, onFail) {
    const self = this;
    const d = Storage.pathDelimiter;
    switch (mode) {
      case Storage.saveModes.add:
        const pathLength = path + d + 'length';
        this._clientStorage.read(pathLength, function(value) {
          const newPath = path + d + value;
          self._clientStorage.save(newPath, data, onWrite, onFail);
        }, onFail);
        break;
      case Storage.saveModes.replace:
        this._clientStorage.save(path, data, onWrite, onFail);
        break;
    }
  };
  Storage.prototype.read = function(path, onWrite, onFail) {
    this._clientStorage.read(path, onWrite, onFail);
  };
  Storage.prototype.readAll = function(onReadAll, onFail) {
    const self = this;
    if (this._clientStorage.isEmpty()) {
      this._serverStorage.read(function(data) {
        self._clientStorage.save('', data, function() {
          onReadAll(data);
        }, onFail);
      });
    } else {
      this._clientStorage.read('', onReadAll, onFail);
    }
  };
  Storage.prototype.erase = function(path, onErase) {
    // this._clientStorage.erase(path, onErase);
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.Storage = Storage;
}());
