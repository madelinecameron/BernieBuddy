Template.postPage.helpers({
	comments: function() {
		return Comments.find({ postId: this._id });
	},
  isMobile: function() {
    return Darwin.device.match("phone");
  }
});

Template.postPage.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result);
  });
})

Template.postPage.events({
  'click #openCommentBox': function(event, err) {
    $('#openCommentBox').hide();
		$('#body').focus();
  }
});
