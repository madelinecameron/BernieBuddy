Template.donate.onCreated(function () {
  Session.set("disableDonateBanner", true)
  if(Meteor.isCordova) {
    store.ready(function() {
      store.refresh();
    });
  }
});

Template.donate.onRendered(function() {
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
  gestures: function () {
		if(Darwin.device.match("phone")) {
			return {
				"swiperight .container": function(event, error) {
					console.log("swipe")
					window.location.replace("/")
				},
				"dragright .container": function(event, error) {
					console.log("SlowSwipe")
				}
			}
		}
		else {
			return {}
		}
	}
})
