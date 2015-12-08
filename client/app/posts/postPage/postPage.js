Template.postPage.events({
  'click #openCommentBox': function(event, err) {
    $('#openCommentBox').hide()
		$('#body').focus()
  }
})

Template.postPage.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result)
  })
})

Template.postPage.helpers({
	comments: function() {
		return Comments.find({ postId: this.id, type: "Post" })
	},
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  // This was needed to load data contexts due to bug in IronRouter
	pageData: function() {
		var data = Posts.findOne({ _id: this.id })
    data["type"] = "Post"
    return data
	},
	gestures: { // Not terribly responsive so basically worth taking out
				'swiperight .form-style': function(event, error) {
					console.log('swipe')
					window.location.replace('/')
				},
				'dragright .form-style': function(event, error) {
					window.location.replace('/')
				}
			}
})
