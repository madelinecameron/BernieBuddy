Template.commentItem.events({
  'click':function() {
    Session.set('selected_comment', this._id);
  },

  'click a.yes':function() {
    if(Meteor.user()) {
      var comment = Comments.findOne({ _id: this._id }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get('selected_comment');

      if ($.inArray(Meteor.userId(), comment.upVoted) !== -1) {
        Comments.update(selectedId, { $pull: {
            upVoted : Meteor.userId()
          },
          $inc: { 'score': -1 }
        });

        return;
      }
      if ($.inArray(Meteor.userId(), comment.downVoted) !== -1) {
        $.extend(update, update, { $pull: { downVoted : Meteor.userId() } });
        netUpdateScore += 1;
      }
      console.log('Voting');
      netUpdateScore += 1
      $.extend(update, update, { $inc: { 'score': netUpdateScore } });
      $.extend(update, update, { $addToSet: { upVoted : Meteor.userId() } });

      Comments.update(selectedId, update);
    }
  },
  'click a.no': function() {
    if (Meteor.user()) {
      var comment = Comments.findOne({ _id: this._id }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get('selected_comment');

      if ($.inArray(Meteor.userId(), comment.upVoted) !== -1) {
        $.extend(update, update, { $pull: { upVoted : Meteor.userId() } });
        netUpdateScore += -1;
      }
      if ($.inArray(Meteor.userId(), comment.downVoted) !== -1) {
        Comments.update(selectedId, { $pull: {
            downVoted : Meteor.userId()
          },
          $inc: { 'score': 1 }
        });

        return;
      }

      console.log('Voting');
      netUpdateScore += -1
      $.extend(update, update, { $inc: { 'score': netUpdateScore } });
      $.extend(update, update, { $addToSet: { downVoted : Meteor.userId() } });

      Comments.update(selectedId, update);

      if (comment.score <= -5) {
        console.log('delete');
        Comments.remove({ _id: this._id })
      }
    }
  }
});

Template.commentItem.onCreated(function() {
  var id = this.data.creatorId;
  if(!Session.get(this.data.creatorId)) {
    console.log("Called");
    Meteor.call('getUserName', id, function(err, result) {
      Session.set(id, result);
    });
  }

  Meteor.call('karmaCount', id, function(err, result) {
    Session.set(id + "karma", result);
  });

});

Template.commentItem.helpers({
  creatorName: function() {
    return Session.get(this.creatorId);
  },
  karma: function() {
    return Session.get(this.creatorId + "karma");
  },
  time: function() {
    var dateCreatedAt = Comments.findOne({ _id: this._id }, {createdAt: 1 });

    if(isNaN(dateCreatedAt.createdAt)) { return "Forever"; }
    var diff = new Date().getTime() - new Date(dateCreatedAt.createdAt).getTime();
    var diff = diff / (1000 * 3600);

    if(diff < 1.0) {
      return Math.round((diff * 60)) + "m"
    }
    else {
      return Math.round(diff) + "h";
    }
  }
});
