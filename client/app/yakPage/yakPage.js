Template.yakPage.helpers({
	comments: function() {
		return Comments.find({ postId: this._id });
	},
  isMobile: function() {
    return Darwin.device.match("phone");
  }
});

Template.yakPage.events({
  'click #openCommentBox': function(event, err) {
    $('#openCommentBox').hide();
  }
});
