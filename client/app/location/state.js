Template.state.onRendered(function() {
  window.scrollTo(0, 0)  // Reset scroll because the scroll will transfer from previous page
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {  // On render, re-request self kudo count
    Session.set('kudos', result)
  })
})

Template.state.helpers({
  posts: function() {
    // If the current sort is 'mostRecent' or if there is no current sort (Most Recent is default)
    if (Session.get('query') === 'mostRecent' || !Session.get('query')) {
      // Sort reverse on sticky and time (Stickies will always be on the top)
      return Posts.find({ location: this.state, anon: false }, { sort: { sticky: -1, createdAt: -1 }}).fetch()
    }
    else {
      // Sort reverse on sticky and score. (Stickies will always be on the top)
      return Posts.find({ location: this.state, anon: false }, { sort: { sticky: -1, score: -1 }}).fetch()
    }
  },
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
	gestures: {  // Basically worthless since it is so slow
				'swiperight .form-style': function(event, error) {
					console.log('swipe')
					window.location.replace('/')
				},
				'dragright .form-style': function(event, error) {
					console.log('SlowSwipe')
				}
			}
})
