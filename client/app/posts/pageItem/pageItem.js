Template.pageItem.events({
  'click #deletePost': function() {
    console.log('Deleting!')
    Articles.remove({ _id: this._id })
    window.location.replace('/')
  },
  'click': function() {
    Session.set('selected_post', this._id)
  },
  'click a.yes': function(event) {
    Meteor.voting.voteUp(event, this._id, "Post")
  },
  'click a.no': function(event) {
    Meteor.voting.voteDown(event, this._id, "Post")
  }
})

Template.pageItem.onCreated(function() {
  var id = this.data.creatorId
  /*if (!Session.get(id) && id !== null) {
    Session.set(id, Meteor.users.findOne({ _id: id }).profile.name)
  }*/
  Meteor.call('kudosCount', id, function(err, result) {
    Session.set(id + 'kudos', result)
  })
})

Template.pageItem.onRendered(function() {
  //Hack-ish way to center the score depending on how many digits it is.
  $('#score' + this.data._id).css('margin-left', (-0.25 * ($('#score' + this.data._id).text().length - 1)).toString() + 'rem')
  if (this.data.location === 'Anonymous Location') {
    $('#location' + this.data._id).attr('href', '#').removeClass('btn').addClass('fakeBtn')
  }
})

Template.pageItem.helpers({
  madeDownvote: function() {
    // If the list of users who downvoted contains the current user
    // Determines whether to add the voted CSS class to the downvote
    return _.contains(this.downVoted, Meteor.userId())
  },
  madeUpvote: function() {
    // If the list of users who upvoted contains the current user
    // Determines whether to add the voted CSS class to the upvote
    return _.contains(this.upVoted, Meteor.userId())
  },
  commentsCount: function() {
    // Number of comments on the post
    return Comments.find({ postId: this._id, type: "Post" }).count()
  },
  creatorName: function() {
    // If session has the username of the post creator, send the name if not send 'Anonymous'
    return Session.get(this.creatorId) ? Session.get(this.creatorId) : 'Anonymous'
  },
  kudos: function() {
    // If the post creator isn't the current user
    // Basically just a difference in how I store their kudos in the session.
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
  userCanDelete: function() {
    return this.creatorId === Meteor.userId() || Meteor.user().isAdmin  //If creator is currently logged in user
  },
  hasPhoto: function() {
    return this.photoLoc  //Null / undefined is false-y, everything is truth-y
  },
  anonLoc: function() {
    return this.location === 'Anonymous Location'
  },
  // Information detailing how to set up social media share
  shareInfo: function() {
    return {
      title: '"' + this.post + '"',
      author: Session.get(this.creatorId) ? Session.get(this.creatorId) : 'Anonymous',
      excerpt: this.score + " kudos",
      url: Meteor.call('shortenURL', window.location.href).id  //id is the shortened
    }
  }
})
