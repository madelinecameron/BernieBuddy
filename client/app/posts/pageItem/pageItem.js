Template.pageItem.events({
  'click #deletePost': function() {
    console.log('Deleting!');
    Posts.remove({ _id: this._id });
    window.location.replace('/');
  },
  'click #stickyPost': function() {
    Posts.update({ _id: this._id }, { $set: { sticky: true } });
  },
  'click #unstickyPost': function() {
    Posts.update({ _id: this._id }, { $set: { sticky: false } });
  },
  'click': function() {
    Session.set('selected_post', this._id);
  },
  'click a.yes': function(event) {
    Meteor.voting.votePostUp(event, this._id)
  },
  'click a.no': function(event) {
    Meteor.voting.votePostDown(event, this._id)
  }
});

Template.pageItem.onCreated(function() {
  var id = this.data.creatorId;
  if (!Session.get(id) && id !== null) {
    console.log(Meteor.users.findOne({ _id: id }).profile.name);
    Meteor.call('getUserName', id, function(err, result) {
      Session.set(id, result);
    });
  }

  Meteor.call('kudosCount', id, function(err, result) {
    Session.set(id + 'kudos', result);
  });
});

Template.pageItem.onRendered(function() {
  //Hack-ish way to center the score depending on how many digits it is.
  $('#score' + this.data._id).css('margin-left', (-0.25 * ($('#score' + this.data._id).text().length - 1)).toString() + 'rem');
  if (this.data.location === 'Anonymous Location') {
    $('#location' + this.data._id).attr('href', '#').removeClass('btn').addClass('fakeBtn');
  }
});

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
    return Session.get(this.creatorId) ? Session.get(this.creatorId) : 'Anonymous'
  },
  kudos: function() {
    if (this.creatorId !== Meteor.userId()) {
        return Session.get(this.creatorId + 'kudos') ? Session.get(this.creatorId + 'kudos') : '0'
    }
    else {
      return Session.get('kudos')
    }
  },
  time: function() {
    return Meteor.utilities.createTimeString(this._id)
  },
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  userCanDelete: function() {
    return this.creatorId === Meteor.userId() || Meteor.user().isAdmin;  //If creator is currently logged in user
  },
  hasPhoto: function() {
    return this.photoLoc  //Null / undefined is false-y, everything is truth-y
  },
  anonLoc: function() {
    return this.location === 'Anonymous Location'
  }
});
