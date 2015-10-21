Template.commentItem.events({
  "click":function() {
    Session.set("selected_comment", this._id)
  },

  "click a.yes":function(event) {  //Upvote
    if(Meteor.user()) {
      var comment = Comments.findOne({ _id: this._id }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get("selected_comment"),  //Comment ID that has been voted on
          element = $(event.currentTarget)  //The element

      element.toggleClass("vote")
      if($(".no").hasClass("vote")) {
        $(".no").removeClass("vote")
      }

      if ($.inArray(Meteor.userId(), comment.upVoted) !== -1) {  //Undo upvote
        Comments.update(selectedId, { $pull: {
            upVoted : Meteor.userId()
          },
          $inc: { "score": -1 }
        })

        return
      }
      if ($.inArray(Meteor.userId(), comment.downVoted) !== -1) {  //Undo downvote
        $.extend(update, update, { $pull: { downVoted : Meteor.userId() } })
        netUpdateScore += 1  //-1 + 1 = 0
      }
      netUpdateScore += 1 //0 + 1 = 1
      $.extend(update, update, { $inc: { "score": netUpdateScore } })  //Increment score
      $.extend(update, update, { $addToSet: { upVoted : Meteor.userId() } })  //Add current user to list of upvoters

      Comments.update(selectedId, update)
      Meteor.users.update(comment.creatorId, { $inc: { "kudos": netUpdateScore } })
    }
  },
  "click a.no": function(event) {  //Downvote
    if (Meteor.user()) {
      var comment = Comments.findOne({ _id: this._id }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get("selected_comment"),
          element = $(event.currentTarget)

      element.toggleClass("vote")
      if($(".yes").hasClass("vote")) {
        $(".yes").removeClass("vote")
      }

      if ($.inArray(Meteor.userId(), comment.upVoted) !== -1) {  //Undo upvote
        $.extend(update, update, { $pull: { upVoted : Meteor.userId() } })
        netUpdateScore += -1
      }
      if ($.inArray(Meteor.userId(), comment.downVoted) !== -1) {  //Updo downvote
        Comments.update(selectedId, { $pull: {
            downVoted : Meteor.userId()
          },
          $inc: { "score": 1 }
        })

        return
      }

      netUpdateScore += -1
      $.extend(update, update, { $inc: { "score": netUpdateScore } })
      $.extend(update, update, { $addToSet: { downVoted : Meteor.userId() } })

      Comments.update(selectedId, update)
      Meteor.users.update(comment.creatorId, { $inc: { "kudos": netUpdateScore } })

      if (comment.score <= -10 && !comment.adminPost) {  //Delete post if score is below threshold and it isn"t an admin post
        console.log("delete")
        Comments.remove({ _id: this._id })
      }
    }
  }
})

Template.commentItem.onCreated(function() {
  var id = this.data.creatorId
  if(!Session.get(id)) {  //If username isn"t stored in session
    Meteor.call("getUserName", id, function(err, result) {
      Session.set(id, result)
    })
  }

  Meteor.call("kudosCount", id, function(err, result) {  //Get kudo count for creator
    Session.set(id + "kudos", result)
  })

})

Template.commentItem.helpers({
  creatorName: function() {
    return Session.get(this.creatorId)  //Return username (retrieved from server when template was created)
  },
  kudos: function() {
    return Session.get(this.creatorId + "kudos")  //Return kudo count (retrieved from server when template was created)
  },
  time: function() {
    var dateCreatedAt = Comments.findOne({ _id: this._id }, {createdAt: 1 })

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
  }
})
