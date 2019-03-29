(function() {
  const ClientStorage = function(name) {
    this._localStorageName = name;
    this._storedObject = {[ClientStorage._rootName]: null};
  };
  ClientStorage._rootName = 'root';
  ClientStorage.path = {
    delimiter: '/',
    arrayMark: '*',
  };
  // ClientStorage.prototype.readAll = function(onRead) {
  //   onRead(this._parsedStorageCookie[ClientStorage._rootName]);
  // };
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
    const text = localStorage.getItem(this._localStorageName);
    if (text) {
      const data = JSON.parse(text);
      this._storedObject[ClientStorage._rootName] = data;
    }
  };
  ClientStorage.prototype.isEmpty = function() {
    const data = localStorage.getItem(this._localStorageName);
    return !(data);
  };
  ClientStorage.prototype.erase = function(path, onDelete) {
    const object = this._storedObject;
    const r = ClientStorage._rootName;
    const d = ClientStorage.path.delimiter;
    path = r + d + path;
    const steps = path.split(d);
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
        localStorage.setItem(this._localStorageName,
            JSON.stringify(object[r]));

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
    const object = this._storedObject;
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
    const r = ClientStorage._rootName;
    const d = ClientStorage.path.delimiter;
    path = r + d + path;
    const object = this._storedObject;
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
    const r = ClientStorage._rootName;
    const d = ClientStorage.path.delimiter;
    path = r + d + path;

    const object = this._storedObject;
    this._editObject(object, path, data);

    this._storedObject = object;
    localStorage.setItem(this._localStorageName,
        JSON.stringify(object[r]));

    onWrite();
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.ClientStorage = ClientStorage;
}());
