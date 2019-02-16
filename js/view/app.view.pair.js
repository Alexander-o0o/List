(function() {
  const viewEvents = window.list_app.events;


  const PairsContainer = function() {
    this._elements = {
      me: document
          .querySelector('.pairs'),
      pairTemplate: document
          .querySelector('#template-pair').content.querySelector('.pair'),
    };
  };
  PairsContainer.prototype._createPairElement = function(pair) {
    const pairElement = this._elements.pairTemplate.cloneNode(true);
    pairElement.setAttribute('data-id', String(pair.id));
    pairElement.querySelector('.pair__name').innerText = pair.name;
    return pairElement;
  };
  PairsContainer.prototype.addPair = function(pair) {
    const pairElement = this._createPairElement(pair);
    const referenceElement = this._elements.me.children[0];
    if (referenceElement) {
      this._elements.me.insertBefore(pairElement, referenceElement);
    } else {
      this._elements.me.appendChild(pairElement);
    }
  };
  PairsContainer.prototype.addPairs = function(pairs) {
    const self = this;
    const Utils = window.list_app.Utils;
    const pairElements = pairs.map(function(pair) {
      return self._createPairElement(pair);
    });
    Utils.appendChilds(this._elements.me, pairElements);
  };
  PairsContainer.prototype.removePair = function(id) {
    const pairElement = this._elements.me
        .querySelector('.pair[data-id="' + id + '"]');
    this._elements.me.removeChild(pairElement);
  };
  PairsContainer.prototype.bindPair = function(id, appEvent, onEvent) {
    switch (appEvent) {
      case viewEvents.PAIR_CLICK:
        const pairElement = this._elements.me
            .querySelector('.pair[data-id="' + id + '"]');

        pairElement.addEventListener('click', function(event) {
          onEvent(Number(event.currentTarget.dataset.id));
        });
        break;
    }
  };


  if (!window.list_app) window.list_app = {};
  window.list_app.PairsContainer = PairsContainer;
}());
