Template.donate.onCreated(function () {
  Session.set("disableDonateBanner", true)
})

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
    return store.products //All registered products
  },
  gestures: function () {
		if(Darwin.device.match("phone")) {
			return {
				"swiperight .form-style": function(event, error) {
					console.log("swipe")
					//window.location.replace("/")
				},
				"slowSwipe .form-style": function(event, error) {
					console.log("SlowSwipe")
				}
			}
		}
		else {
			return {}
		}
	}
})
