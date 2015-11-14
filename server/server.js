Meteor.methods({
  postInsert: function(post) {

    //Find town and state
    var area, location;

    console.log(post.coords);
    //Only possible with no geolocation on... or extreme luck.
    if (post.coords.long == 0 && post.coords.lat == 0) { location = 'Anonymous Location'; }
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
      });
      location = area.state ? area.state : "Anonymous Location";
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
    });
  },
  commentInsert: function(comment) {
    var location, area;
    if (comment.coords.long == 0 && comment.coords.lat == 0) {
      location = 'Anonymous Location';
    }
    else {
      var area = Towns.findOne({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(comment.coords.long), parseFloat(comment.coords.lat)]
            }
          }
        }
      });
      location = area.state;
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
    });
  },
  getUserName: function(id) {
    return Meteor.users.findOne({ _id: id }).profile.name;
  },
  getCommentCount: function(id) {
    return Comments.find({ postId: id }).count();
  },
  kudosCount: function(id) {
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
    ]);

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
    ]);

    var totalKudos = 0;
    if(postKudos.length > 0 && commentKudos.length > 0) {
      totalKudos = postKudos[0].kudos + commentKudos[0].kudos;
    }
    else {
      if(postKudos.length > 0) {
        totalKudos = postKudos[0].kudos;
      }
      if(commentKudos.length > 0) {  //If we are down here, we know one of them is null and we know comment && post can't not be null
        totalKudos = commentKudos[0].kudos;
      }
    }

    var userResult = Meteor.users.findOne({ _id: id }, { kudos: 1 });
    if (userResult) {  //To prevent null objects
      if(userResult.kudos) {
        return totalKudos + userResult.kudos;
      }
      else {
        return totalKudos;
      }
    }
    else {
      return totalKudos;
    }
  },
  chargeCard: function(stripeToken, amount, user) {
      var Stripe = StripeAPI(process.env.DEBUG ? 'sk_test_tIqkZCYayMs99W4WJjfwO5do' : process.env.LIVE_SECRET_STRIPE_KEY);
      try {
        var syncCharge = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);
        var result = syncCharge({
          amount: amount * 100, //in cents
          currency: 'usd',
          source: stripeToken
        });

        if(result) {
          if (result.paid) {
            Meteor.call('sendSlackMessage', 'Someone just donated $' + amount + '!', ':happybernie:', 'DonationBot');
            if (user) {
              Meteor.users.update(user, { $inc: { 'kudos': amount * 50 } });
              return result;
            }
          }
        }
      }
      catch(e) {
        console.log(e);
      }
  },
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
      console.log('ReportedForSure!');
    });
  }
});
