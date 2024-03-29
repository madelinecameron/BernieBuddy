Template.listItem.events({
  'click': function() {
    Session.set('selected_post', this._id)
  },
  'click a.yes': function(event) {
    Meteor.voting.voteUp(event, this._id, "Post")
  },
  'click a.no': function(event) {
    Meteor.voting.voteDown(event, this._id, "Post")
  },
  'click #reportPost': function(e) {
    e.preventDefault()
    $('#reportPost').toggle()
    Meteor.call('sendSlackMessage', 'Post reported: <http://berniebuddydev.herokuapp.com/posts/' + this._id + '>')
    console.log('Reported!')
  }
})

Template.listItem.onCreated(function() {
  var id = this.data.creatorId
  if (!Session.get(id) && id !== null) {
    var postCreator = Meteor.users.findOne({ _id: id });
    if(postCreator) {
      Session.set(id, postCreator.profile.name)
    }
  }
  Meteor.call('kudosCount', id, function(err, result) {
    Session.set(id + 'kudos', result)
  })
})

Template.listItem.onRendered(function() {
  $('#score' + this.data._id).css('margin-left', (-0.25 * ($('#score' + this.data._id).text().length - 1)).toString() + 'rem')
})

Template.listItem.helpers({
  madeDownvote: function() {
    return _.contains(this.downVoted, Meteor.userId())
  },
  madeUpvote: function() {
    return _.contains(this.upVoted, Meteor.userId())
  },
  commentsCount: function() {
    return Comments.find({ postId: this._id, type: "Post" }).count()
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
    return Meteor.utilities.createTimeString(this.createdAt)
  },
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  hasPhoto: function() {
    return this.photoLoc  // Null / undefined is false-y else is truth-y
  },
  anonLoc: function() {
    return this.location === 'Anonymous Location'
  }
})
