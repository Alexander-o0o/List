(function() {
  const Mobile = function() {};
  Mobile.isMobile = function() {
    return !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;
  };

  if (!window.list_app) window.list_app = {};
  window.list_app.Mobile = Mobile;
}());
