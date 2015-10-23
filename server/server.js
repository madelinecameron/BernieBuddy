Meteor.methods({
  postInsert: function(post) {

    //Find town and state
    var area, location

    //Only possible with no geolocation on... or extreme luck.
    if(post.coords.long == 0 && post.coords.lat == 0) { location = "Anonymous Location" }
    else {
      area = Towns.findOne({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [ parseFloat(post.coords.long), parseFloat(post.coords.lat) ]
            }
          }
        }
      })
      location = area.state
    }

    var post_id = Posts.insert({
      post : post.post,  //wow. such many yaks.
      creatorId: post.creatorId,
      score : 0,
      location: location,
      active: true,
      createdAt: new Date(),
      sticky: post.sticky,
      anon: post.anonymous,
      adminPost: post.adminPost
    })
  },
  commentInsert: function(comment) {
    var location, area
    if(comment.coords.long == 0 && comment.coords.lat == 0) { location = "Anonymous Location" }
    else {
      var area = Towns.findOne({
        location: {
          $near: {
            $geometry: {
              type: "Point",
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
      adminPost: comment.adminPost
    })
  },
  getUserName: function(id) {
    return Meteor.users.findOne({ _id: id }).profile.name
  },
  getCommentCount: function(id) {
    return Comments.find({ postId: id }).count()
  },
  kudosCount: function(id) {
    return Meteor.users.findOne({ _id: id }, { kudos: 1 }).kudos;
  },
  chargeCard: function(stripeToken, amount, user) {
    var Stripe = StripeAPI('sk_test_tIqkZCYayMs99W4WJjfwO5do');

    var syncCharge = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);
    var result = syncCharge({
      amount: amount * 100, //in cents
      currency: 'usd',
      source: stripeToken
    });

    if(result.paid) {
      if(user) {
        console.log("Adding " + amount * 50 + " to kudos for " + user + "!")
        Meteor.users.update(user, { $inc: { "kudos": amount * 50 } })
      }
    }
  }
})
