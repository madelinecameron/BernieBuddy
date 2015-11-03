var POSTS_INCREMENT = 20;

if (Meteor.isServer) {
  Meteor.publish('posts', function() {
    return Posts.find({ active: true, sticky: false }, { sort: { createdAt: -1 }, limit: 150 })
  });
  Meteor.publish('stickies', function() {
    return Posts.find({ active: true, sticky: true }, { sort: { createdAt: -1 } })
  });
} else if (Meteor.isClient) {
  Deps.autorun(function() {
    Meteor.subscribe('posts');
    Meteor.subscribe('stickies');
  });
}
