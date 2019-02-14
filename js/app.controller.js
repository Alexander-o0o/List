(function() {
  const View = window.list_app.View;

  const Controller = function(view, model) {
    this._view = view;
    this._model = model;
  };
  // ========================= GROUP 1 ========================
  Controller.prototype._setViewMode = function(element, mode) {
    this._view.dimAllButtons();
    if (this._view.currentMode === mode) {
      this._view.currentMode = View.modes.SHOW;
    } else {
      this._view.currentMode = mode;
      this._view.highlightMenuButton(element);
    }
  };
  Controller.prototype._updatePairValue = function(newPair) {
    const self = this;
    this._model.updatePair(
        newPair,
        function() {
          self._view.openedPair = newPair;
          self._view.closeValueEditForm();
        },
        function(text) {
          self._view.openMessage(text);
        }
    );
  };
  Controller.prototype._createPair = function(nameValue) {
    const self = this;
    const newPair = {
      id: self._model.nextPairId,
      name: nameValue.name,
      value: nameValue.value,
    };
    this._model.addPair(
        newPair,
        function() {
          self._view.closePairCreateForm();
          self._view.addPair(newPair);
          self._view.bindPair(
              newPair.id,
              View.events.PAIR_CLICK,
              function(id) {
                self._onPairClick(id);
              }
          );
        },
        function(text) {
          self._view.openMessage(text);
        }
    );
  };
  Controller.prototype._removePair = function(id) {
    this._view.removePair(id);
  };


  Controller.prototype._openValueShowForm = function(pair) {
    if (!this._view.isValueShowFormHidden()) {
      this._view.clearValueShowForm();
      this._view.fulfilValueShowForm(pair);
    } else {
      this._view.closeAllForms();
    }
    this._view.openValueShowForm(pair);
  };
  Controller.prototype._openValueEditForm = function(pair) {
    if (!this._view.isValueEditFormHidden()) {
      this._view.clearValueEditForm();
      this._view.fulfilValueEditForm(pair);
    } else {
      this._view.closeAllForms();
    }
    this._view.openValueEditForm(pair);
  };
  Controller.prototype._openPairCreateForm = function() {
    if (this._view.openedForm !== View.forms.ADD) {
      this._view.closeAllForms();
      this._view.openPairCreateForm();
    }
  };
  // ========================= GROUP 2 ========================
  Controller.prototype._onPairClick = function(id) {
    const self = this;
    switch (this._view.currentMode) {
      case View.modes.SHOW:
        this._model.getPair(id, function(pair) {
          self._openValueShowForm(pair);
        });
        break;
      case View.modes.EDIT:
        this._model.getPair(id, function(pair) {
          self._openValueEditForm(pair);
        });
        break;
      case View.modes.REMOVE:
        this._model.removePair(id, function() {
          self._removePair(id);
        });
        break;
    }
  };
  Controller.prototype._onMenuAddClick = function() {
    this._openPairCreateForm();
  };


  Controller.prototype._onValueShowFormCloseClick = function() {
    this._view.closeValueShowForm();
  };
  Controller.prototype._onValueEditFormCloseClick = function() {
    this._view.closeValueEditForm();
    if (!this._view.isMessageHidden()) {
      this._view.closeMessage();
    }
  };
  Controller.prototype._onPairCreateFormCloseClick = function() {
    this._view.closePairCreateForm();
    if (!this._view.isMessageHidden()) {
      this._view.closeMessage();
    }
  };


  Controller.prototype._onMessageCloseClick = function() {
    this._view.closeMessage();
  };
  // ========================= GROUP 3 ========================
  Controller.prototype._bind = function() {
    const self = this;
    this._view.bind(View.events.MENUADD_CLICK, function() {
      self._onMenuAddClick();
    });
    this._view.bind(View.events.MENUEDIT_CLICK, function(element) {
      self._setViewMode(element, View.modes.EDIT);
    });
    this._view.bind(View.events.MENUDEL_CLICK, function(element) {
      self._setViewMode(element, View.modes.REMOVE);
    });


    this._view.bind(View.events.PAIR_CLICK, function(id) {
      self._onPairClick(id);
    });


    this._view.bind(View.events.VALUESHOWFORM_CLOSE_CLICK, function() {
      self._onValueShowFormCloseClick();
    });


    this._view.bind(View.events.VALUEEDITFORM_CLOSE_CLICK, function() {
      self._onValueShowFormCloseClick();
    });
    this._view.bind(View.events.VALUEEDITFORM_SAVE_CLICK, function(newPair) {
      self._updatePairValue(newPair);
    });


    this._view.bind(View.events.PAIRCREATEFORM_CLOSE_CLICK, function() {
      self._onPairCreateFormCloseClick();
    });
    this._view.bind(View.events.PAIRCREATEFORM_SAVE_CLICK, function(nameValue) {
      self._createPair(nameValue);
    });


    this._view.bind(View.events.MESSAGE_CLOSE_CLICK, function() {
      self._onMessageCloseClick();
    });
  };
  Controller.prototype.init = function() {
    const self = this;
    this._model.init(function(pairs) {
      self._view.addAllPairs(pairs);
      self._bind();
    });
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.Controller = Controller;
}());
