

if (Meteor.isServer) {
  Meteor.publish('posts', function(limit) {
    return Posts.find({ active: true, sticky: false }, { sort: { createdAt: -1 }, limit: limit })
  });
  Meteor.publish('stickies', function() {
    return Posts.find({ active: true, sticky: true }, { sort: { createdAt: -1 } })
  });
} else if (Meteor.isClient) {
  var POSTS_INCREMENT = 20;
  Session.setDefault('numOfLoadedPosts', POSTS_INCREMENT)
  Meteor.subscribe('stickies')
  Deps.autorun(function() {
    Meteor.subscribe('posts', Session.get('numOfLoadedPosts'));
  });

  function checkForNextPage() {
    var threshold, target = $("#showMoreResults");
    if (!target.length) return;

      threshold = $(window).scrollTop() + $(window).height() - target.height();

      if (target.offset().top < threshold) {
        if (!target.data("visible")) {
          console.log("Loading more!")
          // console.log("target became visible (inside viewable area)");
          target.data("visible", true);
          Session.set("numOfLoadedPosts",
            Session.get("numOfLoadedPosts") + POSTS_INCREMENT);
        }
      } else {
        if (target.data("visible")) {
        // console.log("target became invisible (below viewable arae)");
        target.data("visible", false);
      }
    }
  }

  $(window).scroll(checkForNextPage)
}
