// Form class module
(function __form() {
  const Form = function() {
    this.elements = {};
  };
  Form.prototype.fulfil = function() {
    if (this.constructor === Form) {
      throw new Error('Abstract method is not implemented.');
    }
  };
  Form.prototype.open = function(data) {
    this.fulfil(data);
    this.elements.me.classList.remove('hidden');
  };
  Form.prototype.empty = function() {
    if (this.constructor === Form) {
      throw new Error('Abstract method is not implemented.');
    }
  };
  Form.prototype.close = function() {
    this.elements.me.classList.add('hidden');
    this.empty();
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.Form = Form;
}());


// MessageBox class module
(function __messageBox() {
  const Super = window.list_app.Form;

  const MessageBox = function() {
    Super.call(this);

    this.elements.me = document
        .querySelector('.message');
    this.elements.closeButton = this.elements.me
        .querySelector('.message__close-btn');


    this.elements.messageText = this.elements.me
        .querySelector('.message__text');

    this.elements.me.classList.add('hidden');
    this._isHidden = true;
  };
  MessageBox.prototype = Object.create(Super.prototype);
  MessageBox.prototype.constructor = MessageBox;


  MessageBox.prototype.fulfil = function(text) {
    this.elements.messageText.innerText = text;
  };
  MessageBox.prototype.open = function(data) {
    Super.prototype.open.call(this, data);
    this._isHidden = false;
  };
  MessageBox.prototype.empty = function() {
    this.elements.messageText.innerText = '';
  };
  MessageBox.prototype.close = function() {
    Super.prototype.close.call(this);
    this._isHidden = true;
  };
  MessageBox.prototype.isHidden = function() {
    return this._isHidden;
  };


  if (!window.list_app) window.list_app = {};
  window.list_app.MessageBox = MessageBox;
}());


// CompetitiveForm class module
(function __competitiveForm() {
  const Super = window.list_app.Form;

  // Form which shares place with other forms, and only one of
  // them could occupy this place at a time.
  const CompetitiveForm = function(slotContainer) {
    Super.call(this);

    // Why not just have INTERNAL property which indicates if
    // form is occupying the slot. Because it makes possible
    // situation when two instatces have such their property
    // in 'occupied position' simultaneously, which contradicts
    // the point of this class. Thats why this property should
    // be EXTERNAL.
    if (typeof slotContainer !== 'object' ||
        !('_formSharedSlot' in slotContainer)) {
      throw new Error('Shared slot error.');
    };
    this._container = slotContainer;
  };
  CompetitiveForm.prototype = Object.create(Super.prototype);
  CompetitiveForm.prototype.constructor = CompetitiveForm;


  CompetitiveForm.prototype.open = function(data) {
    if (this._container._formSharedSlot === null) {
      Super.prototype.open.call(this, data);
      this._container._formSharedSlot = this;
    } else {
      throw new Error('Slot is busy.');
    }
  };
  CompetitiveForm.prototype.close = function() {
    Super.prototype.close.call(this);
    this._container._formSharedSlot = null;
  };


  if (!window.list_app) window.list_app = {};
  window.list_app.CompetitiveForm = CompetitiveForm;
}());


// ValueShowForm class module
(function __valueShowForm() {
  const Super = window.list_app.CompetitiveForm;

  const ValueShowForm = function(slotContainer) {
    Super.call(this, slotContainer);

    this.elements.me = document
        .querySelector('.value-show-form');
    this.elements.closeButton = this.elements.me
        .querySelector('.value-show-form__close-btn');


    this.elements.valueContainer = this.elements.me
        .querySelector('.value-show-form__value-container');

    this.openedPair = null;
  };
  ValueShowForm.prototype = Object.create(Super.prototype);
  ValueShowForm.prototype.constructor = ValueShowForm;


  ValueShowForm.prototype.fulfil = function(pair) {
    this.elements.valueContainer.innerText = pair.value;
    this.openedPair = pair;
  };
  ValueShowForm.prototype.empty = function() {
    this.elements.valueContainer.innerText = '';
    this.openedPair = null;
  };


  if (!window.list_app) window.list_app = {};
  window.list_app.ValueShowForm = ValueShowForm;
}());


// ValueEditForm class module
(function __valueEditForm() {
  const Super = window.list_app.CompetitiveForm;

  const ValueEditForm = function(slotContainer) {
    Super.call(this, slotContainer);

    this.elements.me = document
        .querySelector('.value-edit-form');
    this.elements.closeButton = this.elements.me
        .querySelector('.value-edit-form__close-btn');
    this.elements.saveButton = this.elements.me
        .querySelector('.value-edit-form__save-btn');

    this.elements.title = this.elements.me
        .querySelector('.value-edit-form__title');
    this.elements.input = this.elements.me
        .querySelector('.value-edit-form__input');

    this.openedPair = null;
  };
  ValueEditForm.prototype = Object.create(Super.prototype);
  ValueEditForm.prototype.constructor = ValueEditForm;


  ValueEditForm.prototype.fulfil = function(pair) {
    this.elements.title.innerText = pair.name;
    this.elements.input.value = pair.value;
    this.openedPair = pair;
  };
  ValueEditForm.prototype.empty = function() {
    this.elements.title.innerText = '';
    this.elements.input.value = '';
    this.openedPair = null;
  };


  if (!window.list_app) window.list_app = {};
  window.list_app.ValueEditForm = ValueEditForm;
}());


// PairCreateForm class module
(function __pairCreateForm() {
  const Super = window.list_app.CompetitiveForm;

  const PairCreateForm = function(slotContainer) {
    Super.call(this, slotContainer);

    this.elements.me = document
        .querySelector('.pair-create-form');
    this.elements.closeButton = this.elements.me
        .querySelector('.pair-create-form__close-btn');
    this.elements.saveButton = this.elements.me
        .querySelector('.pair-create-form__save-btn');


    this.elements.nameInput = this.elements.me
        .querySelector('#pair-name-input');
    this.elements.valueInput = this.elements.me
        .querySelector('#pair-value-input');

    this.openedPair = null;
  };
  PairCreateForm.prototype = Object.create(Super.prototype);
  PairCreateForm.prototype.constructor = PairCreateForm;


  PairCreateForm.prototype.fulfil = function() {
  };
  PairCreateForm.prototype.empty = function() {
    this.elements.nameInput.value = '';
    this.elements.valueInput.value = '';
  };


  if (!window.list_app) window.list_app = {};
  window.list_app.PairCreateForm = PairCreateForm;
}());
