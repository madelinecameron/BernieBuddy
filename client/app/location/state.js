Template.state.helpers({
  posts: function() {
    console.log(this.state);
    if(Session.get("query") === "mostRecent" || !Session.get("query")) {
      return Posts.find({ location: this.state, anon: false }, { sort: { sticky: -1, createdAt: -1 }}).fetch()
    }
    else {
      return Posts.find({ location: this.state, anon: false }, { sort: { sticky: -1, score: -1 }}).fetch()
    }
  },
  isMobile: function() {
    return Darwin.device.match("phone")
  },
	gestures: {
				"swiperight .form-style": function(event, error) {
					console.log("swipe")
					window.location.replace("/")
				},
				"dragright .form-style": function(event, error) {
					console.log("SlowSwipe")
				}
			}
})

Template.state.events({
  "click .pagination li": function(event, err) {
    var targetId = event.target.id
    var parent = $("#" + targetId).parent()

    if(!parent.hasClass("activeFilter")) {  //Filter not selected
      for(var index in parent.siblings()) {
        var siblingId = parent.siblings()[index].id
        $("#" + siblingId).removeClass("activeFilter")
      }

      parent.addClass("activeFilter")
      parent.removeAttr("selected")

      //Setting the filters in Session allows reactive update
      var query = Session.get("query")
      query = targetId

      Session.set("query", query)
    }
  }
})

Template.state.onRendered(function() {
  Meteor.call("kudosCount", Meteor.userId(), function(err, result) {  //On render, re-request self kudo count
    Session.set("kudos", result)
  })
})
