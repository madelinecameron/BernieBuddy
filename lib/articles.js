if (Meteor.isServer) {
  Meteor.publish('articles', function(limit) {
    return Articles.find({}, { sort: { createdAt: -1 }, limit: limit })
  })
} else if (Meteor.isClient) {
  var ARTICLES_INCREMENT = 20
  Session.setDefault('numOfLoadedArticles', ARTICLES_INCREMENT)
  Deps.autorun(function() {
    Meteor.subscribe('articles', Session.get('numOfLoadedArticles'))
  })

  // View posts.js for more comments on how it works.
  function checkForNextPage() {
    var threshold, target = $("#showMoreResults")
    if (!target.length) return

      threshold = $(window).scrollTop() + $(window).height() - target.height()

      if (target.offset().top < threshold) {
        if (!target.data("visible")) {
          console.log("Loading more!")
          // console.log("target became visible (inside viewable area)")
          target.data("visible", true)
          Session.set("numOfLoadedArticles",
            Session.get("numOfLoadedArticles") + ARTICLES_INCREMENT)
        }
      } else {
        if (target.data("visible")) {
        // console.log("target became invisible (below viewable arae)")
        target.data("visible", false)
      }
    }
  }

  $(window).scroll(checkForNextPage)
}
