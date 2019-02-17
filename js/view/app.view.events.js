(function() {
  const events = {
    INIT: 0,
    PAIR_CLICK: 1,
    VALUESHOWFORM_CLOSE_CLICK: 2,
    MENUEDIT_CLICK: 3,
    VALUEEDITFORM_CLOSE_CLICK: 4,
    VALUEEDITFORM_SAVE_CLICK: 5,
    MENUADD_CLICK: 6,
    PAIRCREATEFORM_CLOSE_CLICK: 7,
    PAIRCREATEFORM_SAVE_CLICK: 8,
    MESSAGE_CLOSE_CLICK: 9,
    MENUDEL_CLICK: 10,
    MENUFILTER_CLICK: 11,
  };

  if (!window.list_app) window.list_app = {};
  window.list_app.events = events;
}());
