Template.postPage.events({
  'click #openCommentBox': function(event, err) {
    $('#openCommentBox').hide();
		$('#body').focus();
  }
});

Template.postPage.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result);
  });
});

Template.postPage.helpers({
	comments: function() {
		return Comments.find({ postId: this.id, type: "Post" });
	},
  isMobile: function() {
    return Meteor.utilities.isMobile();
  },
	pageData: function() {
		var data = Posts.findOne({ _id: this.id });
    data["type"] = "Post"
    return data
	},
	gestures: {
				'swiperight .form-style': function(event, error) {
					console.log('swipe');
					window.location.replace('/');
				},
				'dragright .form-style': function(event, error) {
					window.location.replace('/');
				}
			}
});
