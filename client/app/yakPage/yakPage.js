Template.yakPage.helpers({
	comments: function() {
		return Comments.find({ postId: this._id });
	},
  isMobile: function() {
    return Darwin.device.match("phone");
  }
});

Template.yakPage.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result);
  });
})

Template.yakPage.events({
  'click #openCommentBox': function(event, err) {
    $('#openCommentBox').hide();
  }
});
