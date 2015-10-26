Template.postPage.helpers({
	comments: function() {
		return Comments.find({ postId: this.id });
	},
  isMobile: function() {
    return Darwin.device.match('phone');
  },
	pageData: function() {
		return Posts.findOne({ _id: this.id });
	},
	gestures: {
				'swiperight .form-style': function(event, error) {
					console.log('swipe');
					window.location.replace('/');
				},
				'dragright .form-style': function(event, error) {
					console.log('SlowSwipe');
				}
			}
});

Template.postPage.onCreated(function() {
	console.log('PostPage:');
	console.log(this);
});

Template.postPage.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result);
  });
});

Template.postPage.events({
  'click #openCommentBox': function(event, err) {
    $('#openCommentBox').hide();
		$('#body').focus();
  }
});
