(function() {
  // Sometimes (usually when page is opened from HDD) script
  // doesn't stop on breakpoints. Call to window.prompt is used
  // to suspend script to get a time to open dev console and
  // check/set breackpoints.
  window.prompt('12345');
  const serverStorage = new window.list_app.ServerStorage;
  const clientStorage = new window.list_app.ClientStorage('list_app');
  const storage = new window.list_app.Storage(clientStorage, serverStorage);
  const model = new window.list_app.Model(storage);
  const view = new window.list_app.View;
  const controller = new window.list_app.Controller(view, model);
  controller.init();
}());
