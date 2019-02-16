(function() {
  const Menu = function() {
    this.elements = {
      addButton: document.querySelector('#add-pair-button'),
      editButton: document.querySelector('#edit-pair-button'),
      delButton: document.querySelector('#del-pair-button'),
    };
  };

  Menu.prototype.highlightItem = function(element) {
    element.classList.add('menu__item--active');
  };
  Menu.prototype.dimItem = function(element) {
    element.classList.remove('menu__item--active');
  };
  Menu.prototype.dimAllItems = function() {
    const elements = document
        .querySelectorAll('.menu__item.menu__item--active');
    if (elements.length > 0) {
      Array.from(elements).forEach(Menu.dimItem);
    }
  };

  if (!window.list_app) window.list_app = {};
  window.list_app.Menu = Menu;
}());
