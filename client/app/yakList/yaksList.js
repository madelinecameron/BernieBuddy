Template.yaksList.helpers({
  yaks: function() {
    return Yaks.find().fetch().reverse();
  }
});

Template.yaksList.events({
  'click #openYakBox': function(event, err) {
    $('#openYakBox').hide();
  }
});

Template.yaksList.onCreated(function() {
});

Template.yaksList.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result);
  });
})
