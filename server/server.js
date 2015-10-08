Meteor.methods({
  yakInsert: function(yak) {

    //Find town and state
    var area, location;

    //Only possible with no geolocation on... or extreme luck.
    if(yak.coords.long == 0 && yak.coords.lat == 0) { location = "Anonymous Location" }
    else {
      area = Towns.findOne({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [ parseFloat(yak.coords.long), parseFloat(yak.coords.lat) ]
            }
          }
        }
      });
      location = area.name + ", " + area.state_abbr
    }

    var post_id = Yaks.insert({
      yak : yak.yak,  //wow. such many yaks.
      creatorId: yak.creatorId,
      score : 0,
      location: location,
      active: true,
      createdAt: new Date()
    });
  },
  commentInsert: function(comment) {
    var location, area;
    if(comment.coords.long == 0 && comment.coords.lat == 0) { location = "Anonymous Location"; }
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
      });
      location = area.name + ", " + area.state_abbr;
    }

    Comments.insert({
      comment: comment.text,
      postId: comment.postId,
      creatorId: comment.creatorId,
      location: location,
      createdAt: new Date(),
      score: 0
    });
  },
  getUserName: function(id) {
    return Meteor.users.findOne({ _id: id }).profile.name;
  },
  getCommentCount: function(id) {
    return Comments.find({ postId: id }).count();
  },
  karmaCount: function(id) {
    var postKarma = Yaks.aggregate([
      {
        $match: {
          creatorId: id
        }
      },
      {
        $group: {
          _id: null,
          karma: { $sum: "$score" }
        }
      }
    ]);

    var commentKarma = Comments.aggregate([
      {
        $match: {
          creatorId: id
        }
      },
      {
        $group: {
          _id: null,
          karma: { $sum: "$score" }
        }
      }
    ]);

    var totalKarma = 0;
    if(postKarma.length > 0 && commentKarma.length > 0) {
      totalKarma = postKarma[0].karma + commentKarma[0].karma;
    }
    else {
      if(postKarma.length > 0) {
        totalKarma = postKarma[0].karma;
      }
      if(commentKarma.length > 0) {  //If we are down here, we know one of them is null and we know comment && post can't not be null
        totalKarma = commentKarma[0].karma;
      }
    }

    return totalKarma;
  }
});
