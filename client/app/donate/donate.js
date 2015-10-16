Template.donate.onCreated(function() {
  Session.set("disableDonateBanner", true);
});

Template.donate.onDestroyed(function() {
  Session.set("disableDonateBanner", false);
});

Template.donate.helpers({
  isCordova: function() {
    return Meteor.isCordova
  },
  storeItems: function() {
    console.log(store.products);
    return store.products //All registered products
  },
  gestures: {
    'dragright .form-style': function(event, error) {
      console.log("swipe");
      window.location.replace('/');
    },
    'swiperight .form-style': function(event, error) {
      console.log("swipe");
      window.location.replace('/');
    }
  }
});
