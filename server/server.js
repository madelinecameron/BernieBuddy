Meteor.methods({
	yakInsert: function(yak) {
		var post_id = Yaks.insert({
			yak : yak.yak,  //wow. such many yaks.
			creatorId: yak.creatorId,
			score : 0,
			location: yak.loc,
			active: true
		});
	},
	commentInsert: function(comment) {
		Comments.insert({
			comment: comment.text,
			postId: comment.postId,
			creatorId: comment.creatorId,
			score: 0
		});
	},
	getUserName: function(id) {
		return Meteor.users.findOne({ _id: id }).profile.name;
	},
	getCommentCount: function(id) {
		return Comments.find({ postId: id }).count();
	}
});
