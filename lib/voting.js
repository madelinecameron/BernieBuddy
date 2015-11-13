Meteor.voting = {
  voteCommentUp: function(event, commentId) {
    if (Meteor.user()) {
      var comment = Comments.findOne({ _id: commentId }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get('selected_comment'),  //Comment ID that has been voted on
          element = $(event.currentTarget);  //The element

      element.toggleClass('vote');
      if ($('.no').hasClass('vote')) {
        $('.no').removeClass('vote');
      }

      if ($.inArray(Meteor.userId(), comment.upVoted) !== -1) {  //Undo upvote
        Comments.update(selectedId, { $pull: {
            upVoted: Meteor.userId()
          },
          $inc: { 'score': -1 }
        });

        return;
      }
      if ($.inArray(Meteor.userId(), comment.downVoted) !== -1) {  //Undo downvote
        $.extend(update, update, { $pull: { downVoted: Meteor.userId() } });
        netUpdateScore += 1;  //-1 + 1 = 0
      }
      netUpdateScore += 1; //0 + 1 = 1
      $.extend(update, update, { $inc: { 'score': netUpdateScore } });  //Increment score
      $.extend(update, update, { $addToSet: { upVoted: Meteor.userId() } });  //Add current user to list of upvoters

      Comments.update(selectedId, update);
      Meteor.users.update(comment.creatorId, { $inc: { 'kudos': netUpdateScore } });
    }
  },
  voteCommentDown: function(event, commentId) {
    if (Meteor.user()) {
      var comment = Comments.findOne({ _id: commentId }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get('selected_comment'),
          element = $(event.currentTarget);

      element.toggleClass('vote');
      if ($('.yes').hasClass('vote')) {
        $('.yes').removeClass('vote');
      }

      if ($.inArray(Meteor.userId(), comment.upVoted) !== -1) {  //Undo upvote
        $.extend(update, update, { $pull: { upVoted: Meteor.userId() } });
        netUpdateScore += -1;
      }
      if ($.inArray(Meteor.userId(), comment.downVoted) !== -1) {  //Updo downvote
        Comments.update(selectedId, { $pull: {
            downVoted: Meteor.userId()
          },
          $inc: { 'score': 1 }
        });

        return;
      }

      netUpdateScore += -1;
      $.extend(update, update, { $inc: { 'score': netUpdateScore } });
      $.extend(update, update, { $addToSet: { downVoted: Meteor.userId() } });

      Comments.update(selectedId, update);
      Meteor.users.update(comment.creatorId, { $inc: { 'kudos': netUpdateScore } });

      if (comment.score <= -10 && !comment.adminPost) {  //Delete post if score is below threshold and it isn"t an admin post
        Comments.remove({ _id: commentId });
      }
    }
  },
  votePostUp: function(event, postId) {
    if (Meteor.user()) {
      var post = Posts.findOne({ _id: postId }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get('selected_post'),
          element = $(event.currentTarget);

      element.toggleClass('vote');
      if ($('.no').hasClass('vote')) {
        $('.no').removeClass('vote');
      }

      //Undo upvote!
      if ($.inArray(Meteor.userId(), post.upVoted) !== -1) {
        Posts.update(selectedId, { $pull: {
            upVoted: Meteor.userId()
          },
          $inc: { 'score': -1 }
        });
        Meteor.users.update(post.creatorId, { $inc: { 'kudos': -1 } });
        return;
      }
      //Downvote!
      if ($.inArray(Meteor.userId(), post.downVoted) !== -1) {
        $.extend(update, update, { $pull: { downVoted: Meteor.userId() } });
        netUpdateScore += 1;
      }
      netUpdateScore += 1;
      $.extend(update, update, { $inc: { 'score': netUpdateScore } });
      $.extend(update, update, { $addToSet: { upVoted: Meteor.userId() } });

      Meteor.users.update(post.creatorId, { $inc: { 'kudos': (-1 * post.score) } });
      Meteor.users.update(post.creatorId, { $inc: { 'kudos': post.score + netUpdateScore } });

      Posts.update(selectedId, update);
    }
  },
  votePostDown: function(event, postId) {
    if (Meteor.user()) {
      var post = Posts.findOne({ _id: postId }),
          update = {},
          netUpdateScore = 0,
          selectedId = Session.get('selected_post'),
          element = $(event.currentTarget);

      element.toggleClass('vote');
      if ($('.yes').hasClass('vote')) {
        $('.yes').removeClass('vote');
      }

      if ($.inArray(Meteor.userId(), post.upVoted) !== -1) {
        $.extend(update, update, { $pull: { upVoted: Meteor.userId() } });
        netUpdateScore += -1;
      }
      if ($.inArray(Meteor.userId(), post.downVoted) !== -1) {
        Posts.update(selectedId, { $pull: {
            downVoted: Meteor.userId()
          },
          $inc: { 'score': 1 }
        });
        Meteor.users.update(post.creatorId, { $inc: { 'kudos': 1 } });
        return;
      }

      netUpdateScore += -1;
      $.extend(update, update, { $inc: { 'score': netUpdateScore } });
      $.extend(update, update, { $addToSet: { downVoted: Meteor.userId() } });

      Meteor.users.update(post.creatorId, { $inc: { 'kudos': ( -1 * post.score ) } });
      Meteor.users.update(post.creatorId, { $inc: { 'kudos': post.score + netUpdateScore } });

      Posts.update(selectedId, update);

      if (post.score <= -10 && !post.adminPost) {
        Posts.remove({ _id: postId });
      }
    }
  }
}
