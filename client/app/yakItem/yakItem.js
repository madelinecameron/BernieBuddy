Template.yakItem.events({
  'click':function() {
    Session.set('selected_yak', this._id);
  },

  'click a.yes':function() {
    if(Meteor.user()) {
      var postId = Yaks.findOne({ _id: this._id }),
          update = {},
          netUpdateScore = 0,
          yakId = Session.get('selected_yak');

      if ($.inArray(Meteor.userId(), postId.upVoted) !== -1) {
        Yaks.update(yakId, { $pull: {
            upVoted : Meteor.userId()
          },
          $inc: { 'score': -1 }
        });

        return;
      }
      if ($.inArray(Meteor.userId(), postId.downVoted) !== -1) {
        $.extend(update, update, { $pull: { downVoted : Meteor.userId() } });
        netUpdateScore += 1;
      }
      console.log('Voting');
      netUpdateScore += 1
      $.extend(update, update, { $inc: { 'score': netUpdateScore } });
      $.extend(update, update, { $addToSet: { upVoted : Meteor.userId() } });

      Yaks.update(yakId, update);
    }
  },
  'click a.no': function() {
    if (Meteor.user()) {
      var postId = Yaks.findOne({ _id: this._id }),
          update = {},
          netUpdateScore = 0,
          yakId = Session.get('selected_yak');

      if ($.inArray(Meteor.userId(), postId.upVoted) !== -1) {
        $.extend(update, update, { $pull: { upVoted : Meteor.userId() } });
        netUpdateScore += -1;
      }
      if ($.inArray(Meteor.userId(), postId.downVoted) !== -1) {
        Yaks.update(yakId, { $pull: {
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

      Yaks.update(yakId, update);

      if (postId.score <= -5) {
        console.log('delete');
        Yaks.remove({ _id:this._id })
      }
    }
  }
});

Template.yakItem.onCreated(function() {
  if(!Session.get(this.data.creatorId)) {
    var id = this.data.creatorId;
    Meteor.call('getUserName', id, function(err, result) {
      Session.set(id, result);
    });
  }
});

Template.yakItem.helpers({
  commentsCount: function() {
    return Comments.find({ postId: this._id }).count();
  },
  creatorName: function() {
    return Session.get(this.creatorId);
  }
});
