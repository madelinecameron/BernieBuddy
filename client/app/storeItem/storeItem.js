Template.storeItem.events({
  'click': function (event, err) {
    Session.set("kudos", 1)
    Session.set("debugMsg", this.id);
    store.order(this.id)
  }
})

Template.storeItem.onCreated(function () {
  store.when(this.alias).approved(function (product) {
    Session.set("kudos", 69)
    Session.set("debugMsg", product)
    product.finished()
  });
  store.when(this.alias).error(function(err) {
    Session.set("debugMsg", err);
  })
  Session.set("debugMsg", "Test");
})

Template.storeItem.helpers({
  'debugMsg': function() {
    return Session.get("debugMsg");
  }
})
