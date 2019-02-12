(function() {
  const Model = function(storage) {
    this._storage = storage;
    this._pairsOrder = [];
    this.nextPairId = undefined;
    this._pairs = [];
    this._pairStorageParams = {
      idContainer: 'n',
      orderContainer: 'o',
      pairsContainer: 'p',
    };
  };
  Model.prototype.init = function(onInit, onFail) {
    const self = this;
    const orderContainer = this._pairStorageParams.orderContainer;
    const pairsContainer = this._pairStorageParams.pairsContainer;
    const idContainer = this._pairStorageParams.idContainer;
    this._storage.readAll(function(data) {
      self.nextPairId = data[idContainer];
      self._pairsOrder = data[orderContainer];
      self._pairs = data[pairsContainer];
      const orderedPairs = self._pairsOrder.map(function(id) {
        return self._pairs.filter(function(pair) {
          return pair.id === id;
        })[0];
      });
      const idNamePairs = orderedPairs.map(function(pair) {
        return {id: pair.id, name: pair.name};
      });
      onInit(idNamePairs);
    }, function() {});
  };
  Model.prototype.getPair = function(id, onGet, onFail) {
    const pair = this._pairs.find(function(pair) {
      return pair.id === id;
    });
    if (pair) {
      onGet(pair);
    } else {
      onFail();
    }
  };
  Model.prototype.addPair = function(pair, onAdd, onFail) {
    const self = this;
    const pairsPath = this._pairStorageParams.pairsContainer;
    const orderPath = this._pairStorageParams.orderContainer;
    const idPath = this._pairStorageParams.idContainer;
    const Storage = window.list_app.Storage;
    const OVR = Storage.saveModes.replace;
    const ADD = Storage.saveModes.add;
    this._storage.save(pairsPath, pair, ADD, function() {
      self.nextPairId++;
      self._storage.save(idPath, self.nextPairId, OVR, function() {
        self._pairsOrder.unshift(pair.id);
        self._storage.save(orderPath, self._pairsOrder, OVR, function() {
          self._pairs.push(pair);
          onAdd();
        }, function() {
          // ... remove from order
          // ... decrement nexId
          // ... remove pair
          onFail();
        });
      }, function() {
        // ... decrement nexId
        // ... remove pair
        onFail();
      });
    }, onFail);
  };
  Model.prototype._findPair = function(id, onFind) {
    const pairsPath = this._pairStorageParams.pairsContainer;
    this._storage.findChild(pairsPath, 'id', id, onFind);
  };
  Model.prototype.removePair = function(pair, onRemove) {
    const self = this;
    const orderPath = this._pairStorageParams.orderContainer;
    const Storage = window.list_app.Storage;
    const OVR = Storage.saveModes.replace;
    const d = Storage.pathDelimiter;

    this._findPair(pair.id, function(index) {
      const path = this._pairStorageParams.pairsContainer + d + index;
      self._storage.erase(path, function() {
        self._pairs = self._pairs.filter(function(p) {
          return p.id !== pair.id;
        });
        this._storage.save(
            orderPath, this._pairsOrder, OVR, onRemove, function() {});
      });
    });
  };
  Model.prototype.updatePair = function(pair, onUpdate, onFail) {
    const self = this;
    const Storage = window.list_app.Storage;
    const OVR = Storage.saveModes.replace;
    const d = Storage.pathDelimiter;

    this._findPair(pair.id, function(index) {
      const path = self._pairStorageParams.pairsContainer + d + index;
      self._storage.save(path, pair, OVR, onUpdate, onFail);
    });
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.Model = Model;
}());
