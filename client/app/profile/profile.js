Template.profile.onCreated(function() {
  console.log(this);
  console.log(this.data);
  var id = this.data._id;
  Meteor.call('kudosCount', id, function(err, result) {
    Session.set('profileKudos', result);
  });
});

Template.profile.helpers({
  isOwnProfile: function() {
    return Meteor.userId() === this._id;
  },
  ownYaks: function() {
    return Yaks.find({ creatorId: this._id }).fetch().reverse();
  },
  kudos: function() {
    return Session.get('profileKudos');
  }
});
