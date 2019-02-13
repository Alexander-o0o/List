(function() {
  const ClientStorage = function(name) {
    this._storageCookieName = name;
    this._storageCookieParams = '; expires=' + new Date('2020').toGMTString();
    this._parsedStorageCookie = {[ClientStorage._rootName]: null};
  };
  ClientStorage._capacity = 4000;
  ClientStorage._rootName = 'root';
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
    onRead(this._parsedStorageCookie[ClientStorage._rootName]);
  };
  ClientStorage.prototype._getReference = function(o, path) {
    if (path !== '') {
      const steps = path.split(ClientStorage.path.delimiter);
      let result = o;
      for (let i = 0; i < steps.length; i++) {
        if (steps[i] === '') {
          break;
        }
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
    return encodeURI(text);
  };
  ClientStorage.prototype._decode = function(text) {
    return decodeURI(text);
  };
  ClientStorage.prototype.init = function() {
    const encodedText = this._readCookie(this._storageCookieName);
    if (encodedText && encodedText !== '""') {
      const decodedText = this._decode(encodedText);
      const data = JSON.parse(decodedText);
      this._parsedStorageCookie[ClientStorage._rootName] = data;
    }
  };
  ClientStorage.prototype.isEmpty = function() {
    const text = this._readCookie(this._storageCookieName);
    return !(text && text !== '""');
  };
  ClientStorage.prototype.erase = function(path, onDelete) {
    const pcookie = this._parsedStorageCookie;
    const r = ClientStorage._rootName;
    const d = ClientStorage.path.delimiter;
    path = r + d + path;
    const steps = path.split(ClientStorage.path.delimiter);
    try {
      const child = steps.pop();
      const parent = this._getReference(pcookie, steps.join(d));
      if (child in parent) {
        if (parent instanceof Array &&
            child.search(/^\d+$/) === 0) {
          parent.splice(parseInt(child), 1);
        } else {
          delete parent[child];
        }
        document.cookie = this._storageCookieName +
            '=' + this._encode(JSON.stringify(pcookie[r])) +
            this._storageCookieParams;

        onDelete();
      } else {
        throw new Error('Unreachable path: ' + path);
      };
    } catch (error) {
      throw error;
    }
  };
  ClientStorage.prototype.findChild = function(path, grandchild, data, onFind) {
    const r = ClientStorage._rootName;
    const d = ClientStorage.path.delimiter;
    path = r + d + path;
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
    const r = ClientStorage._rootName;
    const d = ClientStorage.path.delimiter;
    path = r + d + path;
    const pcookie = this._parsedStorageCookie;
    try {
      const value = this._getReference(pcookie, path);
      onRead(value);
    } catch (error) {
      throw error;
    }
  };
  ClientStorage.prototype._copyObject = function(o) {
    const self = this;
    let result = null;
    if (o instanceof Array) {
      result = [];
    } else {
      result = {};
    }
    Object.getOwnPropertyNames(o).forEach(function(key) {
      let value;
      if (typeof o[key] === 'object' && o[key] !== null) {
        value = self._copyObject(o[key]);
      } else {
        value = o[key];
      }
      result[key] = value;
    });
    return result;
  };
  ClientStorage.prototype._editObject = function(o, path, data) {
    if (path !== '') {
      const steps = path.split(ClientStorage.path.delimiter);
      let position = o;
      for (let i = 0; i < steps.length; i++) {
        // // Since we have two types of containers in our tree,
        // // it would be nice to know if type of expected
        // // container (in path) and type of real container (in o)
        // // are matches. Commented because it's nice, but not
        // // necessary.
        // eslint-disable-next-line max-len
        // const stepConstructor = steps[i][0] === ClientStorage.path.arrayMark ?
        //   Array : Object;
        // if (steps[i] in position) {
        //   if (!(position[steps[i]] instanceof stepConstructor)) {
        //   }
        // }
        if (!(steps[i] in position) && steps[i] !== '') {
          position[steps[i]] = steps[i][0] === ClientStorage.path.arrayMark ?
              [] : {};
        }
        if (i === steps.length - 1) {
          if (steps[i] !== '') {
            position[steps[i]] = data;
          } else {
            position[steps[i - 1]] = data;
          }
          break;
        }
        if (steps[i + 1] !== '') {
          position = position[steps[i]];
        }
      }
    } else {
      if (typeof data === 'object' && data !== null) {
        Object.getOwnPropertyNames(data).forEach(function(key) {
          o[key] = data[key];
        });
      } else {
        o = data;
      }
    }
  };
  ClientStorage.prototype._calculateFreeSpace = function(o) {
    const r = ClientStorage._rootName;

    const capacity = ClientStorage._capacity;
    const cookie = document.cookie.length;
    const available = capacity - cookie;

    const future = this._encode(JSON.stringify(o[r])).length;
    const current = this._encode(JSON
        .stringify(this._parsedStorageCookie[r])).length;
    const required = future - current;

    return available - required;
  };
  ClientStorage.prototype.save = function(path, data, onWrite, onFail) {
    const r = ClientStorage._rootName;
    const d = ClientStorage.path.delimiter;
    path = r + d + path;

    const pcookie = this._parsedStorageCookie;
    const pcookieNew = this._copyObject(pcookie);
    this._editObject(pcookieNew, path, data);
    const nextFreeSpace = this._calculateFreeSpace(pcookieNew);
    if (nextFreeSpace > 0) {
      this._parsedStorageCookie = pcookieNew;
      document.cookie = this._storageCookieName +
          '=' + this._encode(JSON.stringify(pcookieNew[r])) +
          this._storageCookieParams;

      onWrite();
    } else {
      onFail('Not enough space.');
    }
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.ClientStorage = ClientStorage;
}());
