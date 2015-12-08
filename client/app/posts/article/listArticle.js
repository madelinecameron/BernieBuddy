Template.listArticle.events({
  'click': function() {
    Session.set('selected_article', this._id)
  },

  'click a.yes': function(event) {
    Meteor.voting.voteUp(event, this._id, "Article")
  },
  'click a.no': function(event) {
    Meteor.voting.voteDown(event, this._id, "Article")
  }
})

Template.listArticle.onRendered(function() {
  // Hack-ish way to change spacing depending on number of digits in the score
  $('#score' + this.data._id).css('margin-left', (-0.25 * ($('#score' + this.data._id).text().length - 1)).toString() + 'rem')
})

Template.listArticle.helpers({
  madeDownvote: function() {
    // If list of downvotes included current user ID
    // Used for setting the 'vote' CSS class
    return _.contains(this.downVoted, Meteor.userId())
  },
  madeUpvote: function() {
    // If list of upvotes included current user ID
    // Used for setting the 'vote' CSS class
    return _.contains(this.upVoted, Meteor.userId())
  },
  commentsCount: function() {
    return Comments.find({ postId: this._id, type: "Article" }).count()
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
})
