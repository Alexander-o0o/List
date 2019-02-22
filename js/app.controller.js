(function() {
  const View = window.list_app.View;

  const Controller = function(view, model) {
    this._view = view;
    this._model = model;
  };
  // ========================= GROUP 1 ========================
  Controller.prototype._updatePairValue = function(newPair) {
    const self = this;
    this._model.updatePair(
        newPair,
        function() {
          self._view.valueEditForm.openedPair = newPair;
          self._view.pairsContainer.markPairAsViewed(newPair.id);
          self._view.valueEditForm.close();
        },
        function(text) {
          self._view.messageBox.open(text);
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
          self._view.pairCreateForm.close();
          self._view.pairsContainer.addPair(newPair);
          self._view.pairsContainer.markPairAsViewed(newPair.id);
          self._view.pairsContainer.bindPair(
              newPair.id,
              View.events.PAIR_CLICK,
              function(id) {
                self._onPairClick(id);
              }
          );
        },
        function(text) {
          self._view.messageBox.open(text);
        }
    );
  };
  Controller.prototype._removePair = function(id) {
    this._view.pairsContainer.removePair(id);
  };


  Controller.prototype._setViewMode = function(element, mode) {
    if (this._view.currentMode === mode) {
      this._view.menu.dimItem(element);
      this._view.currentMode = View.modes.SHOW;
    } else {
      this._view.menu.dimAllItems();
      this._view.currentMode = mode;
      this._view.menu.highlightItem(element);
    }
  };
  Controller.prototype._toggleViewedFilter = function() {
    if (this._view.pairsContainer.isFiltered) {
      this._view.pairsContainer.showUnmarkedPairs();
    } else {
      this._view.pairsContainer.hideUnmarkedPairs();
    }
  };


  Controller.prototype._openValueShowForm = function(pair) {
    const opened = this._view.getOpenedForm();
    const required = this._view.valueShowForm;
    const pairBox = this._view.pairsContainer.getPairBox(pair.id);

    if (opened !== null) {
      if (opened === this._view.valueShowForm ||
          opened === this._view.valueEditForm) {
        const id = opened.openedPair.id;
        this._view.pairsContainer.removePairOpenedMark(id);
      }
      opened.close();
    }
    required.open(pair);
    required.setPosition(pairBox);
  };
  Controller.prototype._openValueEditForm = function(pair) {
    const opened = this._view.getOpenedForm();
    const required = this._view.valueEditForm;

    if (opened !== null) {
      if (opened === this._view.valueShowForm ||
          opened === this._view.valueEditForm) {
        const id = opened.openedPair.id;
        this._view.pairsContainer.removePairOpenedMark(id);
      }
      opened.close();
    }
    required.open(pair);
  };
  Controller.prototype._openPairCreateForm = function() {
    const opened = this._view.getOpenedForm();
    const required = this._view.pairCreateForm;

    if (opened !== required) {
      if (opened !== null) {
        if (opened === this._view.valueShowForm ||
            opened === this._view.valueEditForm) {
          const id = opened.openedPair.id;
          this._view.pairsContainer.removePairOpenedMark(id);
        }
        opened.close();
      }
      required.open();
    }
  };


  Controller.prototype._closeValueShowForm = function() {
    const form = this._view.getOpenedForm();
    const pairId = form.openedPair.id;
    this._view.pairsContainer.removePairOpenedMark(pairId);

    this._view.valueShowForm.close();
    form.resetPosition();
  };
  // ========================= GROUP 2 ========================
  Controller.prototype._onPairClick = function(id) {
    const self = this;
    switch (this._view.currentMode) {
      case View.modes.SHOW:
        if (this._view.getOpenedForm() === this._view.valueShowForm &&
            this._view.valueShowForm.openedPair.id === id) {
          this._closeValueShowForm();
        } else {
          this._model.getPair(id, function(pair) {
            self._openValueShowForm(pair);
            self._view.pairsContainer.markPairAsOpened(id);
            self._view.pairsContainer.markPairAsViewed(id);
          });
        }
        break;
      case View.modes.EDIT:
        this._model.getPair(id, function(pair) {
          self._openValueEditForm(pair);
          self._view.pairsContainer.markPairAsOpened(id);
          self._view.pairsContainer.markPairAsViewed(id);
        });
        break;
      case View.modes.REMOVE:
        this._model.removePair(id, function() {
          self._removePair(id);
        });
        break;
    }
  };


  Controller.prototype._onMenuFilterClick = function() {
    this._toggleViewedFilter();
  };
  Controller.prototype._onMenuAddClick = function() {
    this._openPairCreateForm();
  };


  Controller.prototype._onValueShowFormCloseClick = function() {
    this._closeValueShowForm();
  };
  Controller.prototype._onValueEditFormCloseClick = function() {
    const pairId = this._view.getOpenedForm().openedPair.id;
    this._view.pairsContainer.removePairOpenedMark(pairId);

    this._view.valueEditForm.close();

    if (!this._view.messageBox.isHidden()) {
      this._view.messageBox.close();
    }
  };
  Controller.prototype._onPairCreateFormCloseClick = function() {
    this._view.pairCreateForm.close();

    if (!this._view.messageBox.isHidden()) {
      this._view.messageBox.close();
    }
  };


  Controller.prototype._onMessageCloseClick = function() {
    this._view.messageBox.close();
  };
  // ========================= GROUP 3 ========================
  Controller.prototype._bind = function() {
    const self = this;
    this._view.bind(View.events.MENUFILTER_CLICK, function() {
      self._onMenuFilterClick();
    });
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
      self._onValueEditFormCloseClick();
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
      self._view.pairsContainer.addPairs(pairs);
      self._bind();
    });
  };


  if (!window.list_app) window.list_app = {};
  window.list_app.Controller = Controller;
}());
