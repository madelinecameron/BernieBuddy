Template.profile.helpers({
  'isOwnProfile': function() {
    return Meteor.userId() === this._id;
  },
  'ownYaks': function() {
    return Yaks.find({ creatorId: this._id }).fetch().reverse();
  }
});
