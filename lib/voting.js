Meteor.voting = {
  voteUp: function(event, voteElementId, elementType) {
    if (Meteor.user()) {
      var table, selectedId

      switch(elementType.toUpperCase()) {
        case "POST":
          table = Posts
          selectedId = Session.get('selected_post')
          break;
        case "ARTICLE":
          table = Articles
          selectedId = Session.get('selected_article')
          break;
        case "COMMENT":
          table = Comments
          selectedId = Session.get('selected_comment')
          break;
      }
      var voteElement = table.findOne({ _id: voteElementId }),
          update = {},
          netUpdateScore = 0,
          element = $(event.currentTarget)

      element.toggleClass('vote')
      if ($('.no').hasClass('vote')) {
        $('.no').removeClass('vote')
      }

      //Undo upvote!
      if ($.inArray(Meteor.userId(), voteElement.upVoted) !== -1) {
        table.update(selectedId, { $pull: {
            upVoted: Meteor.userId()
          },
          $inc: { 'score': -1 }
        })
        return
      }
      //Downvote!
      if ($.inArray(Meteor.userId(), voteElement.downVoted) !== -1) {
        $.extend(update, update, { $pull: { downVoted: Meteor.userId() } })
        netUpdateScore += 1
      }
      netUpdateScore += 1
      $.extend(update, update, { $inc: { 'score': netUpdateScore } })
      $.extend(update, update, { $addToSet: { upVoted: Meteor.userId() } })

      table.update(selectedId, update)
    }
  },
  voteDown: function(event, voteElementId, elementType) {
    if (Meteor.user()) {
      var table, selectedId

      switch(elementType.toUpperCase()) {
        case "POST":
          table = Posts
          selectedId = Session.get('selected_post')
          break;
        case "ARTICLE":
          table = Articles
          selectedId = Session.get('selected_article')
          break;
        case "COMMENT":
          table = Comments
          selectedId = Session.get('selected_comment')
          break;
      }
      console.log(table)
      var voteElement = table.findOne({ _id: voteElementId }),
          update = {},
          netUpdateScore = 0,
          element = $(event.currentTarget)

      element.toggleClass('vote')
      if ($('.yes').hasClass('vote')) {
        $('.yes').removeClass('vote')
      }

      if ($.inArray(Meteor.userId(), voteElement.upVoted) !== -1) {
        $.extend(update, update, { $pull: { upVoted: Meteor.userId() } })
        netUpdateScore += -1
      }
      if ($.inArray(Meteor.userId(), voteElement.downVoted) !== -1) {
        table.update(selectedId, { $pull: {
            downVoted: Meteor.userId()
          },
          $inc: { 'score': 1 }
        })
        return
      }

      netUpdateScore += -1
      $.extend(update, update, { $inc: { 'score': netUpdateScore } })
      $.extend(update, update, { $addToSet: { downVoted: Meteor.userId() } })

      table.update(selectedId, update)

      if (voteElement.score <= -100 && !voteElement.adminPost) {
        table.remove({ _id: voteElementId })
      }
    }
  }
}
