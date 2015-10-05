Meteor.methods({
  yakInsert: function(yak) {

    //Find town and state
    var area = Towns.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [ parseFloat(yak.coords.long), parseFloat(yak.coords.lat) ]
          },
          $maxDistance: 1000
        }
      }
    });

    var post_id = Yaks.insert({
      yak : yak.yak,  //wow. such many yaks.
      creatorId: yak.creatorId,
      score : 0,
      location: area.name + ", " + area.state_abbr,
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
  }
});
