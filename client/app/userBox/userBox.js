Template.userBox.onCreated(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result);
  });
});


Template.userBox.helpers({
  kudos: function() {
    return Session.get('kudos');
  },
  isMobile: function() {
    return Darwin.device.match("phone");
  }
});
