Meteor.methods({
  yakInsert: function(yak) {

    //Find town and state
    var area = Towns.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [ parseFloat(yak.coords.long), parseFloat(yak.coords.lat) ]
          }
        }
      }
    });

    var post_id = Yaks.insert({
      yak : yak.yak,  //wow. such many yaks.
      creatorId: yak.creatorId,
      score : 0,
      location: area.name + ", " + area.state_abbr,
      active: true,
      createdAt: new Date()
    });
  },
  commentInsert: function(comment) {
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

    Comments.insert({
      comment: comment.text,
      postId: comment.postId,
      creatorId: comment.creatorId,
      location: area.name + ", " + area.state_abbr,
      createdAt: new Date(),
      score: 0
    });
  },
  getUserName: function(id) {
    var name = Meteor.users.findOne({ _id: id }).profile.name;
    if(name.indexOf(' ') != -1) {  //Only show first names!
      return name.substring(0, name.indexOf(' '));
    }
    else {
      return name;
    }
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
