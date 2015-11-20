Template.dashboard.onCreated(function() {
  if(!Meteor.user().isAdmin) {
    window.location.replace('/');  //Redirect
  }
})
