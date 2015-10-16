var POSTS_INCREMENT = 20;

if (Meteor.isServer) {
  Meteor.publish('posts', function(query) {
    return Posts.find({ active: true }, { sort: { createdAt: -1 } });
  });
} else if (Meteor.isClient) {
  Deps.autorun(function() {
    Meteor.subscribe('posts');
  });
}
