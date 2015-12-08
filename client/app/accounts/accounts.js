Template.accounts.events({
  'click .btn-facebook': function(event, err) {
    Meteor.loginWithFacebook({
      requestPermissions: ['email']
    }, function(err) {
      if (!err) {
        window.location.replace('/')  // Redirect
      }
    })
  },
  'click .btn-twitter': function(event, err) {
    Meteor.loginWithTwitter({
      requestPermissions: ['email']
    }, function(err) {
      if (!err) {
        window.location.replace('/')  // Redirect
      }
    })
  }
})

Template.accounts.onCreated(function() {
  Session.set('disableDonateBanner', false)  // This is used for disabled the banner on /donate
})

Template.accounts.helpers({
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  gestures: {
  	'swiperight .container': function(event, error) {
  		console.log('swipe')
  		window.location.replace('/')
  	},
  	'dragright .container': function(event, error) {
      window.location.replace('/')
  	}
  }
})
