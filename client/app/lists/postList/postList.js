function getStickies() {
  return Posts.find({ sticky: true }).fetch();
}

Template.postList.events({
  'click #openPostBox': function(event, err) {
    $('#openPostBox').hide();
  }
});

Template.postList.onDestroyed(function() {
  delete Session.keys['length'];  //Reset filter
});

Template.postList.onRendered(function() {
  window.scrollTo(0, 0)  // Fixes bug where scroll of page navigated from would be replicated
  if (Meteor.utilities.isMobile()) {
    Session.set('disableDonateBanner', true);
  }

  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result);
  });
});

Template.postList.helpers({
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  posts: function() {
    var stickies = getStickies();
    if (Session.get('query') === 'mostRecent' || !Session.get('query')) {
      return stickies.concat(Posts.find({ sticky: false }, { sort: { sticky: -1, createdAt: -1 }}).fetch())
    }
    else {
      return stickies.concat(Posts.find({ sticky: false }, { sort: { sticky: -1, score: -1 }}).fetch());
    }
  }
});
