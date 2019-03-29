(function() {
  const ClientStorage = function(name) {
  };
  ClientStorage._rootName = 'root';
  ClientStorage.path = {
    delimiter: '/',
    arrayMark: '*',
  };
  // ClientStorage.prototype.readAll = function(onRead) {
  //   onRead(this._parsedStorageCookie[ClientStorage._rootName]);
  // };
  ClientStorage.prototype._readStorage = function(storageKey) {
    let text;
    const object = {};
    if (storageKey === '') {
      Object.keys(localStorage).forEach(function(key) {
        text = localStorage.getItem(key);
        object[key] = JSON.parse(text);
      });
    } else {
      text = localStorage.getItem(storageKey);
      object[storageKey] = JSON.parse(text);
    }
    return object;
  };
  ClientStorage.prototype._writeStorage = function(storageKey, object) {
    if (storageKey === '') {
      Object.getOwnPropertyNames(object).forEach(function(key) {
        localStorage.setItem(key,
            JSON.stringify(object[key]));
      });
    } else {
      localStorage.setItem(storageKey,
          JSON.stringify(object[storageKey]));
    }
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
  ClientStorage.prototype.init = function() {
  };
  ClientStorage.prototype.isEmpty = function() {
    const data = localStorage.length > 0;
    return !(data);
  };
  ClientStorage.prototype.erase = function(path, onDelete) {
    const d = ClientStorage.path.delimiter;
    const steps = path.split(d);
    const firstChild = steps[0];
    const object = this._readStorage(firstChild);

    try {
      const child = steps.pop();
      const parent = this._getReference(object, steps.join(d));
      if (child in parent) {
        if (parent instanceof Array &&
            child.search(/^\d+$/) === 0) {
          parent.splice(parseInt(child), 1);
        } else {
          delete parent[child];
        }
        this._writeStorage(firstChild, object);

        onDelete();
      } else {
        throw new Error('Unreachable path: ' + path);
      };
    } catch (error) {
      throw error;
    }
  };
  ClientStorage.prototype.findChild = function(path, grandchild, data, onFind) {
    const firstChild = path.split(ClientStorage.path.delimiter)[0];
    const object = this._readStorage(firstChild);
    try {
      const parent = this._getReference(object, path);
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
    const firstChild = path.split(ClientStorage.path.delimiter)[0];
    const object = this._readStorage(firstChild);
    try {
      const value = this._getReference(object, path);
      onRead(value);
    } catch (error) {
      throw error;
    }
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
  ClientStorage.prototype.save = function(path, data, onWrite, onFail) {
    const firstChild = path.split(ClientStorage.path.delimiter)[0];
    const object = this._readStorage(firstChild);

    this._editObject(object, path, data);
    this._writeStorage(firstChild, object);
    onWrite();
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.ClientStorage = ClientStorage;
}());
