Template.commentItem.events({
  'click': function() {
    Session.set('selected_comment', this._id);
  },

  'click a.yes': function(event) {  //Upvote
    Meteor.voting.voteCommentUp(event, this._id)
  },
  'click a.no': function(event) {
    Meteor.voting.voteCommentDown(event, this._id)
  }
});

Template.commentItem.onCreated(function() {
  var id = this.data.creatorId;
  if (!Session.get(id)) {  //If username isn"t stored in session
    Meteor.call('getUserName', id, function(err, result) {
      Session.set(id, result);
    });
  }

  Meteor.call('kudosCount', id, function(err, result) {  //Get kudo count for creator
    Session.set(id + 'kudos', result);
  });

});

Template.commentItem.helpers({
  creatorName: function() {
    return Session.get(this.creatorId);  //Return username (retrieved from server when template was created)
  },
  kudos: function() {
    return Session.get(this.creatorId + 'kudos');  //Return kudo count (retrieved from server when template was created)
  },
  time: function() {
    var dateCreatedAt = Comments.findOne({ _id: this._id }, {createdAt: 1 });

    if (isNaN(dateCreatedAt.createdAt)) { return 'Forever' }
    var diff = new Date().getTime() - new Date(dateCreatedAt.createdAt).getTime();
    var diff = diff / (1000 * 3600);  //Returned in ms, 1000ms in a second, 3600s in an hour

    if (diff < 1.0) {  //If the difference is less than 1 hour
      return Math.round((diff * 60)) + 'm';
    }
    else {
      if (diff < 24.0) {  //If the diff is less than 24 hours
        return Math.round(diff) + 'h';
      }
      else {
        if (Math.round(diff / 24.0) > 7.0) {  //If diff / 24 is greater than 7 (days)
          return Math.round(diff / (24.0 * 7.0)) + 'w';
        }
        else {
          return Math.round(diff / 24.0) + 'd';  //Return in days
        }
      }
    }
  },
  isMobile: function() {
    return Darwin.device.match('phone');
  }
});
