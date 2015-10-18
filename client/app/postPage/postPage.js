Template.postPage.helpers({
	comments: function() {
		return Comments.find({ postId: this._id })
	},
  isMobile: function() {
    return Darwin.device.match("phone")
  },
	configureHammer: function () {
		return function (hammer, templateInstance) {
			var slowSwipe = new Hammer.Swipe({
				event: "slowSwipe", /* prefix for custom swipe events, e.g. 2fingerswipeleft, 2fingerswiperight */
				velocity: 0.1
			})
			hammer.add(slowSwipe)
			return hammer
		}
	},
	gestures: function() {
		if(Darwin.device.match("phone")) {
			return {
				"swiperight .form-style": function(event, error) {
					console.log("swipe")
					window.location.replace("/")
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

Template.postPage.onRendered(function() {
  Meteor.call("kudosCount", Meteor.userId(), function(err, result) {
    Session.set("kudos", result)
  })
})

Template.postPage.events({
  "click #openCommentBox": function(event, err) {
    $("#openCommentBox").hide()
		$("#body").focus()
  }
})
