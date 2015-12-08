Template.articlePage.events({
  'click #openCommentBox': function(event, err) {
    $('#openCommentBox').hide()
		$('#body').focus()
  }
})

Template.articlePage.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result)
  })
})

Template.articlePage.helpers({
	comments: function() {
		return Comments.find({ postId: this.id, type: "Article" })
	},
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  // Needed because of bug in IronRouter that causes loss of data context
	pageData: function() {
		var data = Articles.findOne({ _id: this.id })
    data["type"] = "Article"
    return data
	},
	gestures: {  // Basically not worth keeping in since it is so slow
				'swiperight .form-style': function(event, error) {
					console.log('swipe')
					window.location.replace('/')
				},
				'dragright .form-style': function(event, error) {
					window.location.replace('/')
				}
			}
})
