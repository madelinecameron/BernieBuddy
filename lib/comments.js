if (Meteor.isServer) {
  Meteor.publish('comments', function() {
    return Comments.find({});
  });
} else if (Meteor.isClient) {
  Deps.autorun(function() {
    Meteor.subscribe('comments');
  });
}
