(function() {
  const Menu = window.list_app.Menu;
  const PairsContainer = window.list_app.PairsContainer;
  const ValueShowForm = window.list_app.ValueShowForm;
  const ValueEditForm = window.list_app.ValueEditForm;
  const PairCreateForm = window.list_app.PairCreateForm;
  const MessageBox = window.list_app.MessageBox;

  const View = function() {
    this.currentMode = View.modes.SHOW;
    this._formSharedSlot = null;

    this.menu = new Menu;
    this.pairsContainer = new PairsContainer;
    this.valueShowForm = new ValueShowForm(this);
    this.valueEditForm = new ValueEditForm(this);
    this.pairCreateForm = new PairCreateForm(this);
    this.messageBox = new MessageBox;
  };
  View.modes = {
    SHOW: 0,
    EDIT: 1,
    REMOVE: 2,
  };
  View.events = window.list_app.events;
  View.prototype.getOpenedForm = function() {
    return this._formSharedSlot;
  };


  View.prototype.bind = function(appEvent, onEvent) {
    const self = this;
    switch (appEvent) {
      case View.events.MENUFILTER_CLICK:
        this.menu.elements
            .filterButton.addEventListener('click', function(event) {
              event.preventDefault();
              onEvent();
            });
        break;
      case View.events.MENUADD_CLICK:
        this.menu.elements
            .addButton.addEventListener('click', function(event) {
              event.preventDefault();
              onEvent();
            });
        break;
      case View.events.MENUEDIT_CLICK:
        this.menu.elements
            .editButton.addEventListener('click', function(event) {
              event.preventDefault();
              onEvent(event.currentTarget);
            });
        break;
      case View.events.MENUDEL_CLICK:
        this.menu.elements
            .delButton.addEventListener('click', function(event) {
              event.preventDefault();
              onEvent(event.currentTarget);
            });
        break;
      case View.events.PAIR_CLICK:
        const pairElements = Array.from(document.querySelectorAll('.pair'));
        pairElements.forEach(function(pairElement) {
          pairElement.addEventListener('click', function(event) {
            onEvent(Number(event.currentTarget.dataset.id));
          });
        });
        break;
      case View.events.VALUESHOWFORM_CLOSE_CLICK:
        this.valueShowForm.elements
            .closeButton.addEventListener('click', function(event) {
              event.preventDefault();
              onEvent();
            });
        break;
      case View.events.VALUEEDITFORM_CLOSE_CLICK:
        this.valueEditForm.elements
            .closeButton.addEventListener('click', function(event) {
              event.preventDefault();
              onEvent();
            });
        break;
      case View.events.VALUEEDITFORM_SAVE_CLICK:
        const valueInputEdit = this.valueEditForm.elements.input;

        this.valueEditForm.elements
            .saveButton.addEventListener('click', function(event) {
              const newPair = {
                id: self.valueEditForm.openedPair.id,
                name: self.valueEditForm.openedPair.name,
                value: valueInputEdit.value,
              };

              event.preventDefault();
              onEvent(newPair);
            });
        break;
      case View.events.PAIRCREATEFORM_CLOSE_CLICK:
        this.pairCreateForm.elements
            .closeButton.addEventListener('click', function(event) {
              event.preventDefault();
              onEvent();
            });
        break;
      case View.events.PAIRCREATEFORM_SAVE_CLICK:
        const nameInputCreate = this.pairCreateForm.elements.nameInput;
        const valueInputCreate = this.pairCreateForm.elements.valueInput;

        this.pairCreateForm.elements
            .saveButton.addEventListener('click', function(event) {
              const nameValue = {
                name: nameInputCreate.value,
                value: valueInputCreate.value,
              };

              event.preventDefault();
              onEvent(nameValue);
            });
        break;
      case View.events.MESSAGE_CLOSE_CLICK:
        this.messageBox.elements
            .closeButton.addEventListener('click', function(event) {
              event.preventDefault();
              onEvent();
            });
        break;
    }
  };


  if (!window.list_app) window.list_app = {};
  window.list_app.View = View;
}());
