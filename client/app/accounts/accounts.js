Template.accounts.events({
  "click .btn-facebook": function(event, err) {
    Meteor.loginWithFacebook({
      requestPermissions: ["email"]
    })
    window.location.replace('/');
  },
  "click .btn-twitter": function(event, err) {
    Meteor.loginWithTwitter({
      requestPermissions: ["email"]
    })
    window.location.replace('/');
  }
})

Template.accounts.onCreated(function() {
  Session.set("disableDonateBanner", false)
})
