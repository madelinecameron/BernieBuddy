Template.state.onRendered(function() {
  window.scrollTo(0,0)
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {  //On render, re-request self kudo count
    Session.set('kudos', result);
  });
});

Template.state.helpers({
  posts: function() {
    if (Session.get('query') === 'mostRecent' || !Session.get('query')) {
      return Posts.find({ location: this.state, anon: false }, { sort: { sticky: -1, createdAt: -1 }}).fetch();
    }
    else {
      return Posts.find({ location: this.state, anon: false }, { sort: { sticky: -1, score: -1 }}).fetch();
    }
  },
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
	gestures: {
				'swiperight .form-style': function(event, error) {
					console.log('swipe');
					window.location.replace('/');
				},
				'dragright .form-style': function(event, error) {
					console.log('SlowSwipe');
				}
			}
});
