Template.accounts.events({
  "click .btn-facebook": function(event, err) {
    Meteor.loginWithFacebook({
      requestPermissions: ["email"]
    })
  },
  "click .btn-twitter": function(event, err) {
    Meteor.loginWithTwitter({
      requestPermissions: ["email"]
    })
  }
})
