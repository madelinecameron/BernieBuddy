Template.userBox.onCreated(function() {
  console.log(Meteor.userId());
  Meteor.call('karmaCount', Meteor.userId(), function(err, result) {
    Session.set('karma', result);
  });
});


Template.userBox.helpers({
  karma: function() {
    return Session.get('karma');
  }
});
