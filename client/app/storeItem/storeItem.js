var button = "click #" + this.id;

Template.storeItem.events({
  button: function (event, err) {
    Session.set("kudos", 1)
    var productId = event.target.id
    store.order(productId)
  }
})

Template.storeItem.onCreated(function () {
  store.when(this.alias).approved(function (product) {
    Session.set("kudos", 69)
    product.finished()
  })
})
