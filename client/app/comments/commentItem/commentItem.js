Template.commentItem.events({
  'click': function() {
    Session.set('selected_comment', this._id)
  },

  'click a.yes': function(event) {  //Upvote
    Meteor.voting.voteUp(event, this._id, "Comment")
  },
  'click a.no': function(event) {
    Meteor.voting.voteDown(event, this._id, "Comment")
  }
})

Template.commentItem.onCreated(function() {
  var id = this.data.creatorId
  if (!Session.get(id)) {  // If username isn"t stored in session
    Session.set(id, Meteor.users.findOne({ _id: id }).profile.name)
  }

  Meteor.call('kudosCount', id, function(err, result) {  // Get kudo count for creator
    Session.set(id + 'kudos', result)
  })

})

Template.commentItem.helpers({
  creatorName: function() {
    return Session.get(this.creatorId)  // Return username (retrieved from server when template was created)
  },
  kudos: function() {
    return Session.get(this.creatorId + 'kudos')  // Return kudo count (retrieved from server when template was created)
  },
  time: function() {
    return Meteor.utilities.createTimeString(this.createdAt)
  },
  isMobile: function() {
    return Meteor.utilities.isMobile()
  }
})
