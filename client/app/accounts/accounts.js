Template.accounts.events({
  "click .btn-facebook": function(event, err) {
    Meteor.loginWithFacebook({
      requestPermissions: ["email"]
    }, function(err) {
      if(!err) {
        window.location.replace('/');  //Redirect
      }
    });
  },
  "click .btn-twitter": function(event, err) {
    Meteor.loginWithTwitter({
      requestPermissions: ["email"]
    }, function(err) {
      if(!err) {
        window.location.replace('/');  //Redirect
      }
    })
  }
})

Template.accounts.onCreated(function() {
  Session.set("disableDonateBanner", false)
})
