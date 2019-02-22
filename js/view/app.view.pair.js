(function() {
  const viewEvents = window.list_app.events;


  const PairsContainer = function() {
    this._elements = {
      me: document
          .querySelector('.pairs'),
      pairTemplate: document
          .querySelector('#template-pair').content.querySelector('.pair'),
    };
    this.isFiltered = false;
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
  PairsContainer.prototype.getPairBox = function(id) {
    const pairElement = this._elements.me
        .querySelector('.pair[data-id="' + id + '"]');
    return {
      x: pairElement.offsetLeft,
      y: pairElement.offsetTop,
      width: pairElement.offsetWidth,
      height: pairElement.offsetHeight,
    };
  };
  PairsContainer.prototype.markPairAsViewed = function(id) {
    const pairElement = this._elements.me
        .querySelector('.pair[data-id="' + id + '"]');
    pairElement.classList.add('pair--viewed');
  };
  PairsContainer.prototype.markPairAsOpened = function(id) {
    const pairElement = this._elements.me
        .querySelector('.pair[data-id="' + id + '"]');
    pairElement.classList.add('pair--opened');
  };
  PairsContainer.prototype.removePairOpenedMark = function(id) {
    const pairElement = this._elements.me
        .querySelector('.pair[data-id="' + id + '"]');
    pairElement.classList.remove('pair--opened');
  };
  PairsContainer.prototype.hideUnmarkedPairs = function(id) {
    const pairElements = this._elements.me
        .querySelectorAll('.pair:not(.pair--viewed)');

    if (pairElements.length > 0) {
      Array.from(pairElements).forEach(function(pairElement) {
        pairElement.classList.add('hidden');
      });
    }
    this.isFiltered = true;
  };
  PairsContainer.prototype.showUnmarkedPairs = function(id) {
    const pairElements = this._elements.me
        .querySelectorAll('.pair:not(.pair--viewed).hidden');

    if (pairElements.length > 0) {
      Array.from(pairElements).forEach(function(pairElement) {
        pairElement.classList.remove('hidden');
      });
    }
    this.isFiltered = false;
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
