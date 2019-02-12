(function() {
  const View = function() {
    this.currentMode = View.modes.SHOW;
    this.openedForm = null;
    this.openedPair = null;
    this._elements = {};
    this._elements.pairsContainer = document.querySelector('.pairs');
    this._elements.templatePair = document.querySelector('#template-pair')
        .content.querySelector('.pair');
    this._elements.valueShowForm = document.querySelector('.value-show-form');
    this._elements.valueEditForm = document.querySelector('.value-edit-form');
    this._elements.pairCreateForm = document.querySelector('.pair-create-form');
  };
  View.forms = {
    SHOW: 0,
    EDIT: 1,
    ADD: 3,
  };
  View.modes = {
    SHOW: 0,
    EDIT: 1,
    REMOVE: 2,
  };
  View.events = {
    INIT: 0,
    PAIR_CLICK: 1,
    VALUESHOWFORM_CLOSE_CLICK: 2,
    MENUEDIT_CLICK: 3,
    VALUEEDITFORM_CLOSE_CLICK: 4,
    VALUEEDITFORM_SAVE_CLICK: 5,
    MENUADD_CLICK: 6,
    PAIRCREATEFORM_CLOSE_CLICK: 7,
    PAIRCREATEFORM_SAVE_CLICK: 8,
  };
  View.prototype._createPairElement = function(pair) {
    const pairElement = this._elements.templatePair.cloneNode(true);
    pairElement.setAttribute('data-id', String(pair.id));
    pairElement.querySelector('.pair__name').innerText = pair.name;
    return pairElement;
  };
  View.prototype.addPair = function(pair) {
    const pairsContainer = this._elements.pairsContainer;
    const pairElement = this._createPairElement(pair);
    const referenceElement = pairsContainer.children[0];
    if (referenceElement) {
      pairsContainer.insertBefore(pairElement, referenceElement);
    } else {
      pairsContainer.appendChild(pairElement);
    }
  };
  View.prototype.addAllPairs = function(pairs) {
    const self = this;
    const Utils = window.list_app.Utils;
    const pairsContainer = this._elements.pairsContainer;
    const pairElements = pairs.map(function(pair) {
      return self._createPairElement(pair);
    });
    Utils.appendChilds(pairsContainer, pairElements);
  };
  // show form
  View.prototype.isValueShowFormHidden = function() {
    return this._elements.valueShowForm.classList.contains('hidden');
  };
  View.prototype.fulfilValueShowForm = function(pair) {
    const valueShowForm = this._elements.valueShowForm;
    const valueContainer = valueShowForm
        .querySelector('.value-show-form__value-container');
    valueContainer.innerText = pair.value;
    this.openedPair = pair;
  };
  View.prototype.openValueShowForm = function(pair) {
    this.fulfilValueShowForm(pair);
    this._elements.valueShowForm.classList.remove('hidden');
    this.openedForm = View.forms.SHOW;
  };
  View.prototype.clearValueShowForm = function() {
    const valueShowForm = this._elements.valueShowForm;
    const valueContainer = valueShowForm
        .querySelector('.value-show-form__value-container');
    valueContainer.innerText = '';
    this.openedPair = null;
  };
  View.prototype.closeValueShowForm = function() {
    const valueShowForm = this._elements.valueShowForm;
    valueShowForm.classList.add('hidden');
    this.clearValueShowForm();
    this.openedForm = null;
  };


  // edit form
  View.prototype.isValueEditFormHidden = function() {
    return this._elements.valueEditForm.classList.contains('hidden');
  };
  View.prototype.fulfilValueEditForm = function(pair) {
    const valueEditForm = this._elements.valueEditForm;
    const title = valueEditForm
        .querySelector('.value-edit-form__title');
    const input = valueEditForm
        .querySelector('.value-edit-form__input');
    title.innerText = pair.name;
    input.value = pair.value;
    this.openedPair = pair;
  };
  View.prototype.openValueEditForm = function(pair) {
    this.fulfilValueEditForm(pair);
    this._elements.valueEditForm.classList.remove('hidden');
    this.openedForm = View.forms.EDIT;
  };
  View.prototype.clearValueEditForm = function() {
    const valueEditForm = this._elements.valueEditForm;
    const title = valueEditForm
        .querySelector('.value-edit-form__title');
    const input = valueEditForm
        .querySelector('.value-edit-form__input');
    title.innerText = '';
    input.value = '';
    this.openedPair = null;
  };
  View.prototype.closeValueEditForm = function() {
    const valueEditForm = this._elements.valueEditForm;
    valueEditForm.classList.add('hidden');
    this.clearValueEditForm();
    this.openedForm = null;
  };


  // create form
  View.prototype.isPairCreateFormHidden = function() {
    return this._elements.valueEditForm.classList.contains('hidden');
  };
  View.prototype.openPairCreateForm = function(pair) {
    this._elements.pairCreateForm.classList.remove('hidden');
    this.openedForm = View.forms.ADD;
  };
  View.prototype.clearPairCreateForm = function() {
    const pairCreateForm = this._elements.pairCreateForm;
    const nameInput = pairCreateForm
        .querySelector('#pair-name-input');
    const valueInput = pairCreateForm
        .querySelector('#pair-value-input');
    nameInput.value = '';
    valueInput.value = '';
  };
  View.prototype.closePairCreateForm = function() {
    const pairCreateForm = this._elements.pairCreateForm;
    pairCreateForm.classList.add('hidden');
    this.clearPairCreateForm();
    this.openedForm = null;
  };


  // forms end
  View.prototype.closeAllForms = function() {
    switch (this.openedForm) {
      case View.forms.SHOW:
        this.closeValueShowForm();
        break;
      case View.forms.EDIT:
        this.closeValueEditForm();
        break;
      case View.forms.ADD:
        this.closePairCreateForm();
        break;
    }
  };
  View.prototype.highlightMenuButton = function(element) {
    element.classList.add('menu__item--active');
  };
  View.prototype.dimMenuButton = function(element) {
    element.classList.remove('menu__item--active');
  };
  View.prototype.isMenuButtonHighlighted = function(element) {
    return element.classList.contains('menu__item--active');
  };
  View.prototype.dimAllButtons = function() {
    const elements = document
        .querySelectorAll('.menu__item.menu__item--active');
    if (elements.length > 0) {
      Array.from(elements).forEach(View.prototype.dimMenuButton);
    }
  };
  View.prototype.bindPair = function(id, appEvent, onEvent) {
    switch (appEvent) {
      case View.events.PAIR_CLICK:
        const pairElement = document
            .querySelector('.pair[data-id="' + id + '"]');

        pairElement.addEventListener('click', function(event) {
          onEvent(Number(event.currentTarget.dataset.id));
        });
        break;
    }
  };
  View.prototype.bind = function(appEvent, onEvent) {
    const self = this;
    const valueEditForm = this._elements.valueEditForm;
    const pairCreateForm = this._elements.pairCreateForm;
    switch (appEvent) {
      case View.events.INIT:
        document.addEventListener('load', onEvent);
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
        const valueShowForm = this._elements.valueShowForm;
        const closeButtonShow = valueShowForm
            .querySelector('.value-show-form__close-btn');
        closeButtonShow.addEventListener('click', function(event) {
          event.preventDefault();
          onEvent();
        });
        break;
      case View.events.VALUEEDITFORM_CLOSE_CLICK:
        const closeButtonEdit = valueEditForm
            .querySelector('.value-edit-form__close-btn');
        closeButtonEdit.addEventListener('click', function(event) {
          event.preventDefault();
          onEvent();
        });
        break;
      case View.events.VALUEEDITFORM_SAVE_CLICK:
        const valueInputEdit = valueEditForm
            .querySelector('.value-edit-form__input');
        const saveButtonEdit = valueEditForm
            .querySelector('.value-edit-form__save-btn');
        saveButtonEdit.addEventListener('click', function(event) {
          const newPair = {
            id: self.openedPair.id,
            name: self.openedPair.name,
            value: valueInputEdit.value,
          };
          event.preventDefault();
          onEvent(newPair);
        });
        break;
      case View.events.MENUEDIT_CLICK:
        const editButtonMenu = document
            .querySelector('#edit-pair-button');
        editButtonMenu.addEventListener('click', function(event) {
          event.preventDefault();
          onEvent(event.currentTarget);
        });
        break;
      case View.events.PAIRCREATEFORM_CLOSE_CLICK:
        const closeButtonCreate = pairCreateForm
            .querySelector('.pair-create-form__close-btn');
        closeButtonCreate.addEventListener('click', function(event) {
          event.preventDefault();
          onEvent();
        });
        break;
      case View.events.PAIRCREATEFORM_SAVE_CLICK:
        const nameInputCreate = document
            .querySelector('#pair-name-input');
        const valueInputCreate = document
            .querySelector('#pair-value-input');
        const saveButtonCreate = pairCreateForm
            .querySelector('.pair-create-form__save-btn');
        saveButtonCreate.addEventListener('click', function(event) {
          const nameValue = {
            name: nameInputCreate.value,
            value: valueInputCreate.value,
          };
          event.preventDefault();
          onEvent(nameValue);
        });
        break;
      case View.events.MENUADD_CLICK:
        const addButtonMenu = document
            .querySelector('#add-pair-button');
        addButtonMenu.addEventListener('click', function(event) {
          event.preventDefault();
          onEvent(event.currentTarget);
        });
        break;
    }
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.View = View;
}());
