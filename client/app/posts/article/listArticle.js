Template.listArticle.events({
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

Template.listArticle.onRendered(function() {
  $('#score' + this.data._id).css('margin-left', (-0.25 * ($('#score' + this.data._id).text().length - 1)).toString() + 'rem');
});

Template.listArticle.helpers({
  madeDownvote: function() {
    return _.contains(this.downVoted, Meteor.userId());
  },
  madeUpvote: function() {
    return _.contains(this.upVoted, Meteor.userId());
  },
  commentsCount: function() {
    return Comments.find({ postId: this._id, type: "Article" }).count();
  },
  time: function() {
    console.log(this.createdAt)
    return Meteor.utilities.createTimeString(this.createdAt)
  },
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  hasPhoto: function() {
    return this.pic  // Null / undefined is false-y else is truth-y
  }
});
