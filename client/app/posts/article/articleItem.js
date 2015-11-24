Template.articleItem.events({
  'click #deletePost': function() {
    console.log('Deleting!');
    Articles.remove({ _id: this._id });
    window.location.replace('/');
  },
  'click': function() {
    Session.set('selected_article', this._id);
  },
  'click a.yes': function(event) {
    Meteor.voting.voteArticleUp(event, this._id)
  },
  'click a.no': function(event) {
    Meteor.voting.voteArticleDown(event, this._id)
  }
});

Template.articleItem.onCreated(function() {
  console.log(this.data)
})

Template.articleItem.onRendered(function() {
  //Hack-ish way to center the score depending on how many digits it is.
  $('#score' + this.data._id).css('margin-left', (-0.25 * ($('#score' + this.data._id).text().length - 1)).toString() + 'rem');
  if (this.data.location === 'Anonymous Location') {
    $('#location' + this.data._id).attr('href', '#').removeClass('btn').addClass('fakeBtn');
  }
});

Template.articleItem.helpers({
  madeDownvote: function() {
    return _.contains(this.downVoted, Meteor.userId())
  },
  madeUpvote: function() {
    return _.contains(this.upVoted, Meteor.userId())
  },
  commentsCount: function() {
    return Comments.find({ postId: this._id, type: "Article" }).count()
  },
  time: function() {
    return Meteor.utilities.createTimeString(this.createdAt)
  },
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  userCanDelete: function() {
    return this.creatorId === Meteor.userId() || Meteor.user().isAdmin;  //If creator is currently logged in user
  },
  hasPhoto: function() {
    return this.pic  //Null / undefined is false-y, everything is truth-y
  },
  shareInfo: function() {
    return {
      title: '"' + this.summary + '" from berniebuddy.com',
      author: 'Bernie Buddy',
      excerpt: this.score + " kudos",
      url: Meteor.call('shortenURL', window.location.href).id  //id is the shortened
    };
  }
});
