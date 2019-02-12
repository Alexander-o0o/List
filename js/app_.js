(function() {
  const serverStorage = new window.list_app.ServerStorage;
  const clientStorage = new window.list_app.ClientStorage('list_app');
  const storage = new window.list_app.Storage(clientStorage, serverStorage);
  const model = new window.list_app.Model(storage);
  const view = new window.list_app.View;
  const controller = new window.list_app.Controller(view, model);
  controller.init();
}());
