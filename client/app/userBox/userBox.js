Template.userBox.onCreated(function() {
  Meteor.call("kudosCount", Meteor.userId(), function(err, result) {
    Session.set("kudos", result)
  })
})

Template.userBox.helpers({
  kudos: function() {
    return Session.get("kudos")
  },
  isMobile: function() {
    return Darwin.device.match("phone")
  }
})

Template.userBox.events({
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
