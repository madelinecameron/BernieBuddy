Template.donate.onCreated(function () {
  Session.set("disableDonateBanner", true)
});

Template.donate.onRendered(function() {
  if(Meteor.isCordova) {
    store.ready(function() {
      store.refresh();
    });
  }
});

Template.donate.onDestroyed(function () {
  Session.set("disableDonateBanner", false)
})

Template.donate.helpers({
  isCordova: function () {
    return Meteor.isCordova
  },
  isMobile: function () {
    return Darwin.device.match("phone")
  },
  storeItems: function () {
    return store.products
  },
  gestures:
  {
  	"swiperight .container": function(event, error) {
  		console.log("swipe")
  		window.location.replace("/")
  	},
  	"dragright .container": function(event, error) {
  		console.log("SlowSwipe")
      window.location.replace("/")
  	}
  }
})
