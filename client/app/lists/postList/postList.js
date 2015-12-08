function getStickies() {
  return Posts.find({ sticky: true }).fetch()
}

Template.postList.events({
  'click #openPostBox': function(event, err) {
    $('#openPostBox').hide()
    $('#fileUpload').hide()
  }
})

Template.postList.onDestroyed(function() {
  delete Session.keys['length']  // Reset length for post creation
})

Template.postList.onRendered(function() {
  window.scrollTo(0, 0)  // Fixes bug where scroll of page navigated from would be replicated
  if (Meteor.utilities.isMobile()) {
    Session.set('disableDonateBanner', true)
  }

  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result)
  })
})

Template.postList.helpers({
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  posts: function() {
    var stickies = getStickies()
    // This shows the new method for retaining sticky order across page reloads
    // If query is mostRecent or there is no query (Most Recent is default)
    if (Session.get('query') === 'mostRecent' || !Session.get('query')) {
      // Sort descending time and sticky. Stickies will always be on top
      return stickies.concat(Posts.find({ sticky: false }, { sort: { sticky: -1, createdAt: -1 }}).fetch())
    }
    else {
      // Sort descending score and sticky. Stickies will always be on top
      return stickies.concat(Posts.find({ sticky: false }, { sort: { sticky: -1, score: -1 }}).fetch())
    }
  },
  moreResults: function() {
    // Reload posts. This will cause stickies to be skipped if there is more the POST_INCREMENT number of stickies.
    return Posts.find({ sticky: false }).count() > Session.get("numOfLoadedPosts")
  }
})
