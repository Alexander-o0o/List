(function() {
  const Controller = function(view, model) {
    this._view = view;
    this._model = model;
  };
  Controller.prototype.init = function() {
    const self = this;
    // eslint-disable-next-line no-unused-vars
    const View = window.list_app.View;
    this._onPairClick = function(id) {
      switch (self._view.currentMode) {
        case View.modes.SHOW:
          self._model.getPair(id, function(pair) {
            if (!self._view.isValueShowFormHidden()) {
              self._view.clearValueShowForm();
              self._view.fulfilValueShowForm(pair);
            } else {
              self._view.closeAllForms();
            }
            self._view.openValueShowForm(pair);
          });
          break;
        case View.modes.EDIT:
          self._model.getPair(id, function(pair) {
            if (!self._view.isValueEditFormHidden()) {
              self._view.clearValueEditForm();
              self._view.fulfilValueEditForm(pair);
            } else {
              self._view.closeAllForms();
            }
            self._view.openValueEditForm(pair);
          });
          break;
        case View.modes.REMOVE:
          self._model.removePair(id, function() {
            self._view.removePair(id);
          });
          break;
      }
    };
    this._menuModeClick = function(element, mode) {
      this._view.dimAllButtons();
      if (this._view.currentMode === mode) {
        this._view.currentMode = View.modes.SHOW;
      } else {
        this._view.currentMode = mode;
        this._view.highlightMenuButton(element);
      }
    };
    this._model.init(function(pairs) {
      self._view.addAllPairs(pairs);

      self._view.bind(View.events.PAIR_CLICK, self._onPairClick);
      self._view.bind(View.events.VALUESHOWFORM_CLOSE_CLICK, function() {
        self._view.closeValueShowForm();
      });
      self._view.bind(View.events.MENUEDIT_CLICK, function(element) {
        self._menuModeClick(element, View.modes.EDIT);
      });
      self._view.bind(View.events.VALUEEDITFORM_CLOSE_CLICK, function() {
        self._view.closeValueEditForm();
        if (!self._view.isMessageHidden()) {
          self._view.closeMessage();
        }
      });
      self._view.bind(View.events.VALUEEDITFORM_SAVE_CLICK, function(newPair) {
        self._model.updatePair(
            newPair,
            function() {
              self._view.openedPair = newPair;
              self._view.closeValueEditForm();
            },
            function(text) {
              self._view.openMessage(text);
            });
      });
      self._view.bind(View.events.MENUADD_CLICK, function(element) {
        if (self._view.openedForm !== View.forms.ADD) {
          self._view.closeAllForms();
          self._view.openPairCreateForm();
        }
      });
      self._view.bind(View.events.PAIRCREATEFORM_CLOSE_CLICK, function() {
        self._view.closePairCreateForm();
        if (!self._view.isMessageHidden()) {
          self._view.closeMessage();
        }
      });
      self._view.bind(View.events.PAIRCREATEFORM_SAVE_CLICK,
          function(nameValue) {
            const newPair = {
              id: self._model.nextPairId,
              name: nameValue.name,
              value: nameValue.value,
            };
            self._model.addPair(
                newPair,
                function() {
                  self._view.closePairCreateForm();
                  self._view.addPair(newPair);
                  self._view.bindPair(
                      newPair.id,
                      View.events.PAIR_CLICK,
                      self._onPairClick
                  );
                },
                function(text) {
                  self._view.openMessage(text);
                });
          }
      );
      self._view.bind(View.events.MESSAGE_CLOSE_CLICK, function() {
        self._view.closeMessage();
      });
      self._view.bind(View.events.MENUDEL_CLICK, function(element) {
        self._menuModeClick(element, View.modes.REMOVE);
      });
    });
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.Controller = Controller;
}());
