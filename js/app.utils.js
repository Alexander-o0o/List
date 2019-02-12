(function() {
  const Utils = function() {};
  Utils._InsertMode = {
    APPEND: 0,
    PREPEND: 1,
  };
  Utils._insertChild = function(element, child, mode) {
    switch (mode) {
      case Utils._InsertMode.APPEND:
        element.appendChild(child);
        break;
      case Utils._InsertMode.PREPEND:
        const referenceElement = element.children[0];
        if (referenceElement) {
          element.insertBefore(child, referenceElement);
        } else {
          element.appendChild(child);
        }
        break;
    };
  };
  Utils._insertChilds = function(element, childs, mode) {
    const fragment = document.createDocumentFragment();
    childs.forEach((i) => {
      this._insertChild(fragment, i, mode);
    });
    this._insertChild(element, fragment, mode);
  };
  Utils.prependChilds = function(element, childs) {
    this._insertChilds(element, childs, Utils._InsertMode.PREPEND);
  };
  Utils.appendChilds = function(element, childs) {
    this._insertChilds(element, childs, Utils._InsertMode.APPEND);
  };
  if (!window.list_app) window.list_app = {};
  window.list_app.Utils = Utils;
}());
