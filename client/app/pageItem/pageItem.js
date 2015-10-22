Template.pageItem.events({
  "click #deletePost": function() {
    console.log("Deleting!")
    Posts.remove({ _id: this._id })
    window.location.replace("/")
  },
  "click #stickyPost": function() {
    Posts.update({ _id: this._id }, { $set: { sticky: true } })
  },
  "click #unstickyPost": function() {
    Posts.update({ _id: this._id }, { $set: { sticky: false } })
  },
  "click": function() {
    Session.set("selected_post", this._id)
  },
  "click a.yes": function(event) {
    if(Meteor.user()) {
      var postId = Posts.findOne({ _id: this._id }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get("selected_post"),
          element = $(event.currentTarget)

      element.toggleClass("vote")
      if($(".no").hasClass("vote")) {
        $(".no").removeClass("vote")
      }

      //Undo upvote!
      if ($.inArray(Meteor.userId(), postId.upVoted) !== -1) {
        Posts.update(selectedId, { $pull: {
            upVoted : Meteor.userId()
          },
          $inc: { "score": -1 }
        })

        return
      }
      //Downvote!
      if ($.inArray(Meteor.userId(), postId.downVoted) !== -1) {
        $.extend(update, update, { $pull: { downVoted : Meteor.userId() } })
        netUpdateScore += 1
      }
      console.log("Voting")
      netUpdateScore += 1
      $.extend(update, update, { $inc: { "score": netUpdateScore } })
      $.extend(update, update, { $addToSet: { upVoted : Meteor.userId() } })

      Posts.update(selectedId, update)
    }
  },
  "click a.no": function(event) {
    if (Meteor.user()) {
      var post = Posts.findOne({ _id: this._id }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get("selected_post"),
          element = $(event.currentTarget)

      element.toggleClass("vote")
      if($(".yes").hasClass("vote")) {
        $(".yes").removeClass("vote")
      }

      if ($.inArray(Meteor.userId(), post.upVoted) !== -1) {
        $.extend(update, update, { $pull: { upVoted : Meteor.userId() } })
        netUpdateScore += -1
      }
      if ($.inArray(Meteor.userId(), post.downVoted) !== -1) {
        Yaks.update(selectedId, { $pull: {
            downVoted : Meteor.userId()
          },
          $inc: { "score": 1 }
        })

        return
      }

      console.log("Voting")
      netUpdateScore += -1
      $.extend(update, update, { $inc: { "score": netUpdateScore } })
      $.extend(update, update, { $addToSet: { downVoted : Meteor.userId() } })

      Posts.update(selectedId, update)

      if (post.score <= -10 && !post.adminPost) {
        console.log("delete")
        Posts.remove({ _id: this._id })
      }
    }
  }
})

Template.pageItem.onCreated(function() {
  var id = this.data.creatorId
  if(!Session.get(id) && id !== null) {
    Meteor.call("getUserName", id, function(err, result) {
      Session.set(id, result)
    })
  }

  Meteor.call("kudosCount", id, function(err, result) {
    Session.set(id + "kudos", result)
  })
})

Template.pageItem.onRendered(function() {
  $("#score" + this.data._id).css("margin-left", (-0.25 * ($("#score" + this.data._id).text().length - 1)).toString() + "rem")
  if(this.data.location === "Anonymous Location") {
    $("#location" + this.data._id).attr("href", "#").removeClass("btn").addClass("fakeBtn")
  }
})

Template.pageItem.helpers({
  madeDownvote: function() {
    return _.contains(this.downVoted, Meteor.userId())
  },
  madeUpvote: function() {
    return _.contains(this.upVoted, Meteor.userId())
  },
  commentsCount: function() {
    return Comments.find({ postId: this._id }).count()
  },
  creatorName: function() {
    return Session.get(this.creatorId) ? Session.get(this.creatorId) : "Anonymous"
  },
  kudos: function() {
    if(this.creatorId !== Meteor.userId()) {
        return Session.get(this.creatorId + "kudos") ? Session.get(this.creatorId + "kudos") : "?"
    }
    else {
      return Session.get("kudos")
    }
  },
  time: function() {
    var dateCreatedAt = Posts.findOne({ _id: this._id }, {createdAt: 1 })

    if(isNaN(dateCreatedAt.createdAt)) { return "Forever" }
    var diff = new Date().getTime() - new Date(dateCreatedAt.createdAt).getTime()
    var diff = diff / (1000 * 3600)  //Returned in ms, 1000ms in a second, 3600s in an hour

    if(diff < 1.0) {  //If the difference is less than 1 hour
      return Math.round((diff * 60)) + "m"
    }
    else {
      if(diff < 24.0) {  //If the diff is less than 24 hours
        return Math.round(diff) + "h"
      }
      else {
        if(Math.round(diff / 24.0) > 7.0) {  //If diff / 24 is greater than 7 (days)
          return Math.round(diff / (24.0 * 7.0)) + "w"
        }
        else {
          return Math.round(diff / 24.0) + "d"  //Return in days
        }
      }
    }
  },
  isMobile: function() {
    return Darwin.device.match("phone")
  },
  userCanDelete: function() {
    return this.creatorId === Meteor.userId() || Meteor.user().isAdmin  //If creator is currently logged in user
  }
})
