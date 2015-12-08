Template.adminDashboard.onRendered(function() {
  // This needs to be fixed since any user can access /admin if they type it in.
  var isAdmin = Meteor.users.findOne({ _id: Meteor.userId() }, { isAdmin: 1})
  if(!isAdmin || !Meteor.userId()) {
    //window.location.replace('/')  //Redirect
  }
})
