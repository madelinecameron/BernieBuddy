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
      createdAt: new Date(),
      sticky: yak.sticky
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
  kudosCount: function(id) {
    var postKudos = Yaks.aggregate([
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

    return totalKudos;
  }
});
