Template.articleList.onDestroyed(function() {
  delete Session.keys['length']  //Reset length limit of created posts
})

Template.articleList.onRendered(function() {
  window.scrollTo(0, 0)  // Fixes bug where scroll of page navigated from would be replicated
  if (Meteor.utilities.isMobile()) {
    Session.set('disableDonateBanner', true)
  }

  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result)
  })
})

Template.articleList.helpers({
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  articles: function() {
    // See other postList.js for details if you are wondering
    if (Session.get('query') === 'mostRecent' || !Session.get('query')) {
      return Articles.find({}, { sort: { createdAt: -1 }}).fetch()
    }
    else {
      return Articles.find({}, { sort: { score: -1 }}).fetch()
    }
  },
  moreResults: function() {
    return Articles.find({}).count() > Session.get("numOfLoadedArticles")
  }
})
