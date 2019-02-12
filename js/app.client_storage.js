(function() {
  const ClientStorage = function(name) {
    this._storageCookieName = name;
    this._storageCookieParams = '; expires=' + new Date('2020').toGMTString();
    this._parsedStorageCookie = null;
  };
  ClientStorage._capacity = 4000;
  ClientStorage._encode = {
    replacements: [
      {find: '_', replace: '_e'},
      {find: ' ', replace: '_s'},
    ],
  };
  ClientStorage.path = {
    delimiter: '/',
    arrayMark: '*',
  };
  ClientStorage.prototype._readCookie = function(name) {
    const storageCookie = document.cookie
        .split('; ').find(function(cookie) {
          const cookieParts = cookie.split('=');
          return cookieParts[0] === name;
        });
    if (storageCookie) {
      return storageCookie.split('=')[1];
    }
  };
  ClientStorage.prototype.readAll = function(onRead) {
    onRead(this._parsedStorageCookie);
  };
  ClientStorage.prototype._getReference = function(o, path) {
    if (path !== '') {
      const steps = path.split(ClientStorage.path.delimiter);
      let result = o;
      for (let i = 0; i < steps.length; i++) {
        if (!(steps[i] in result)) {
          throw new Error('Unreachable path: ' + path);
        }
        result = result[steps[i]];
      }
      return result;
    } else {
      return o;
    }
  };
  ClientStorage.prototype._encode = function(text) {
    const reps = ClientStorage._encode.replacements;
    for (let i = 0; i < reps.length; i++) {
      text = text.replace(reps[i].find, reps[i].replace);
    }
    return text;
  };
  ClientStorage.prototype._decode = function(text) {
    const reps = ClientStorage._encode.replacements;
    for (let i = reps.length - 1; i >= 0; i--) {
      text = text.replace(reps[i].replace, reps[i].find);
    }
    return text;
  };
  ClientStorage.prototype.init = function() {
    const encodedText = this._readCookie(this._storageCookieName);
    if (encodedText) {
      const decodedText = this._decode(encodedText);
      const data = JSON.parse(decodedText);
      this._parsedStorageCookie = data;
    }
  };
  ClientStorage.prototype.isEmpty = function() {
    return this._parsedStorageCookie === null;
  };
  ClientStorage.prototype.delete = function(path, onDelete) {
    const pcookie = this._parsedStorageCookie;
    const steps = path.split(ClientStorage.path.delimiter);
    const d = ClientStorage.path.delimiter;
    try {
      const child = steps.pop();
      const parent = this._getReference(pcookie, steps.join(d));
      if (child in parent) {
        delete parent[child];
        document.cookie = this._storageCookieName +
            '=' + this._encode(JSON.stringify(pcookie));

        onDelete();
      } else {
        throw new Error('Unreachable path: ' + path);
      };
    } catch (error) {
      throw error;
    }
  };
  ClientStorage.prototype.findChild = function(path, grandchild, data, onFind) {
    const pcookie = this._parsedStorageCookie;
    try {
      const parent = this._getReference(pcookie, path);
      const childs = Object.keys(parent);
      for (let i = 0; i < childs.length; i++) {
        if (parent[childs[i]][grandchild] === data) {
          onFind(i);
          break;
        }
      }
    } catch (error) {
      throw error;
    }
  };
  ClientStorage.prototype.read = function(path, onRead) {
    const pcookie = this._parsedStorageCookie;
    try {
      const value = this._getReference(pcookie, path);
      onRead(value);
    } catch (error) {
      throw error;
    }
  };
  ClientStorage.prototype._copyObject = function(o) {
    const result = Object.create(Object.getPrototypeOf(o));
    Object.getOwnPropertyNames(o).forEach(function(key) {
      result[key] = o[key];
    });
    return result;
  };
  ClientStorage.prototype._editObject = function(o, path, data) {
    if (path !== '') {
      const steps = path.split(ClientStorage.path.delimiter);
      let position = o;
      for (let i = 0; i < steps.length; i++) {
        if (!(steps[i] in position)) {
          position[steps[i]] = steps[i][0] === ClientStorage.path.arrayMark ?
              [] : {};
        }
        if (i === steps.length - 1) {
          position[steps[i]] = data;
          break;
        }
        position = position[steps[i]];
      }
    } else {
      if (typeof data === 'object') {
        Object.getOwnPropertyNames(data).forEach(function(key) {
          o[key] = data[key];
        });
      } else {
        o = data;
      }
    }
  };
  ClientStorage.prototype._isDataFits = function(o) {
    const capacity = ClientStorage._capacity;
    const cookie = document.cookie.length;
    const available = capacity - cookie;

    const future = this._encode(JSON.stringify(o)).length;
    const current = this._encode(JSON
        .stringify(this._parsedStorageCookie)).length;
    const required = future - current;

    return available > required;
  };
  ClientStorage.prototype.save = function(path, data, onWrite, onFail) {
    if (this._parsedStorageCookie === null) {
      this._parsedStorageCookie = {};
      document.cookie = this._storageCookieName +
          '={}' + this._storageCookieParams;
    }
    const pcookie = this._parsedStorageCookie;
    const pcookieNew = this._copyObject(pcookie);
    this._editObject(pcookieNew, path, data);
    if (this._isDataFits(pcookieNew)) {
      this._parsedStorageCookie = pcookieNew;
      document.cookie = this._storageCookieName +
          '=' + this._encode(JSON.stringify(pcookieNew));

      onWrite();
    } else {
      onFail();
    }
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.ClientStorage = ClientStorage;
}());
