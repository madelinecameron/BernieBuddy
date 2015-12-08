

if (Meteor.isServer) {
  // Split of sticky and posts needed due to request for stickies not to lose order between refreshes
  Meteor.publish('posts', function(limit) {
    // Reverse sort by time (newest first)
    return Posts.find({ active: true, sticky: false }, { sort: { createdAt: -1 }, limit: limit })
  })
  Meteor.publish('stickies', function() {
    // Reverse sort by time (newest first)
    return Posts.find({ active: true, sticky: true }, { sort: { createdAt: -1 } })
  })
} else if (Meteor.isClient) {
  var POSTS_INCREMENT = 20  // Number of posts per page (Infinite scroll)
  Session.setDefault('numOfLoadedPosts', POSTS_INCREMENT)
  Meteor.subscribe('stickies')
  Deps.autorun(function() {  // Runs every tick
    Meteor.subscribe('posts', Session.get('numOfLoadedPosts'))
  })

  function checkForNextPage() {
    var threshold, target = $("#showMoreResults")
    if (!target.length) return

      threshold = $(window).scrollTop() + $(window).height() - target.height()  // If the user has scrolled into view of #showMoreResults

      if (target.offset().top < threshold) {
        if (!target.data("visible")) {
          console.log("Loading more!")
          // console.log("target became visible (inside viewable area)")
          target.data("visible", true)
          Session.set("numOfLoadedPosts",
            Session.get("numOfLoadedPosts") + POSTS_INCREMENT)
        }
      } else {
        if (target.data("visible")) {
        // console.log("target became invisible (below viewable arae)")
        target.data("visible", false)
      }
    }
  }

  $(window).scroll(checkForNextPage)  // Runs event everytime the window is scrolled
}
