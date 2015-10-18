var POSTS_INCREMENT = 20

Template.postList.helpers({
  isMobile: function() {
    return Darwin.device.match("phone")
  },
  posts: function() {
    if(Session.get("query") === "mostRecent" || !Session.get("query")) {
      return Posts.find({}, { sort: { sticky: -1, createdAt: -1 }}).fetch()
    }
    else {
      return Posts.find({}, { sort: { sticky: -1, score: -1 }}).fetch()
    }
  }
})

Template.postList.events({
  "click #openPostBox": function(event, err) {
    $("#openPostBox").hide()
  },
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

      var query = Session.get("query")
      query = targetId

      Session.set("query", query)
    }
  }
})

Template.postList.onCreated(function() {
  setTimeout(function() {
    console.log("Loaded")
  }, 250)
})

Template.postList.onRendered(function() {
  if(Darwin.device.match("phone")) {
    Session.set("disableDonateBanner", true)  
  }

  Meteor.call("kudosCount", Meteor.userId(), function(err, result) {
    Session.set("kudos", result)
  })

  console.log($("#mostRecentFilter").hasClass("active"))
})
