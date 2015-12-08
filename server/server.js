Meteor.methods({
  /* Method for inserting a new post */
  postInsert: function(post) {
    //Find town and state
    var area, location

    //Only possible with no geolocation on... or extreme luck.
    if (post.coords.long == 0 && post.coords.lat == 0) { location = 'Anonymous Location' }
    else {
      area = Towns.findOne({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [ parseFloat(post.coords.long), parseFloat(post.coords.lat) ]
            }
          }
        }
      })
      location = area.state ? area.state : "Anonymous Location"
    }

    var post_id = Posts.insert({
      post: post.post,  //wow. such many yaks.
      creatorId: post.creatorId,
      score: 0,
      location: location,
      active: true,
      createdAt: new Date(),
      sticky: post.sticky,
      anon: post.anonymous,
      adminPost: post.adminPost,
      photoLoc: post.photoLoc
    })
  },
  /* Method for inserting a new comment to a post */
  commentInsert: function(comment) {
    var location, area
    if (comment.coords.long == 0 && comment.coords.lat == 0) {
      location = 'Anonymous Location'
    }
    else {
      var area = Towns.findOne({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [ parseFloat(comment.coords.long), parseFloat(comment.coords.lat) ]
            }
          }
        }
      })
      location = area.state
    }

    Comments.insert({
      comment: comment.text,
      postId: comment.postId,
      creatorId: comment.creatorId,
      location: location,
      createdAt: new Date(),
      score: 0,
      anon: comment.anonymous,
      adminPost: comment.adminPost,
      type: comment.type
    })
  },
  /* Get the number of comments on a given post */
  getCommentCount: function(id) {
    return Comments.find({ postId: id }).count()
  },
  /* Get the kudo amount of a user, given their ID */
  kudosCount: function(id) {
    // This unblocks the thread, eliminating all waiting.
    //Kudos will load as they are sent back from the server, but thread isn't blocked
    this.unblock()
    // Find all posts whose creator id matches given id, group them then sum their scores
    var postKudos = Posts.aggregate([
      {
        $match: {
          creatorId: id
        }
      },
      {
        $group: {
          _id: null,
          kudos: { $sum: "$score" }
        }
      }
    ])
    //Find all comments whose creator id matches given id, group and sum their scores
    var commentKudos = Comments.aggregate([
      {
        $match: {
          creatorId: id
        }
      },
      {
        $group: {
          _id: null,
          kudos: { $sum: "$score" }
        }
      }
    ])

    var totalKudos = 0
    // Checks to see if there is comment and post aggregates
    // The following lines could be reduced to a ternary operator but this is cleaner
    if(postKudos.length > 0 && commentKudos.length > 0) {
      totalKudos = postKudos[0].kudos + commentKudos[0].kudos
    }
    else {
      if(postKudos.length > 0) {
        totalKudos = postKudos[0].kudos
      }
      if(commentKudos.length > 0) {  //If we are down here, we know one of them is null and we know comment && post can't not be null
        totalKudos = commentKudos[0].kudos
      }
    }

    // Find the kudos on a user document.
    // Only bought or rewarded kudos are stored on user document
    var userResult = Meteor.users.findOne({ _id: id }, { kudos: 1 })
    if (userResult) {  // To prevent null objects
      if(userResult.kudos) {  // If kudos exists on user document
        return totalKudos + userResult.kudos
      }
      else {
        return totalKudos
      }
    }
    else {
      return totalKudos
    }
  },
  /* This is the backend for charging cards with Stripe */
  chargeCard: function(stripeToken, amount, user) {
      var Stripe = StripeAPI(process.env.DEBUG ? 'sk_test_tIqkZCYayMs99W4WJjfwO5do' : process.env.LIVE_SECRET_STRIPE_KEY)
      try {
        var syncCharge = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges)
        var result = syncCharge({
          amount: amount * 100, //in cents
          currency: 'usd',
          source: stripeToken
        })

        if(result) {
          if (result.paid) {
            Meteor.call('sendSlackMessage', 'Someone just donated $' + amount + '!', ':happybernie:', 'DonationBot')
            if (user) {
              Meteor.users.update(user, { $inc: { 'kudos': amount * 50 } })
              return result
            }
          }
        }
      }
      catch(e) {
        console.log(e)
      }
  },
  /* Send a message to a Slack channel */
  sendSlackMessage: function(message, icon, bot_name) {
    //Send a message to Slack channel
    HTTP.post('https://hooks.slack.com/services/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',
    {
      data: {
        text: message,
        bot_name: bot_name ? bot_name : 'Bernie Buddy Reporter',
        icon_emoji: icon ? icon : ':cold_sweat:'
      }
    },
    function() {
      console.log('ReportedForSure!')
    })
  },
  /* Create article to be posted */
  postArticle: function(url, pic, summary) {
    return Articles.insert({
      url: url,
      pic: pic,
      summary: summary,
      createdAt: new Date(),  // Current date
      score: 0
    })
  },
  /* Create template pictures for articles */
  insertTemplatePic: function(name, url) {
    return TemplatePics.insert({
      name: name,
      url: url
    })
  }
})
