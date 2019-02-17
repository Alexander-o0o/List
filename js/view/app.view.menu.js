(function() {
  const Menu = function() {
    this.elements = {
      filterButton: document.querySelector('#filter-viewed-button'),
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
      Array.from(elements).forEach(this.dimItem);
    }
  };

  if (!window.list_app) window.list_app = {};
  window.list_app.Menu = Menu;
}());
