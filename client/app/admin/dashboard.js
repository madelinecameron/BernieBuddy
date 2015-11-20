Template.adminDashboard.onRendered(function() {
  if(!Meteor.user().isAdmin) {
    window.location.replace('/');  //Redirect
  }
})
