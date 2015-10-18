Template.profile.onCreated(function () {
  var id = this.data._id
  Meteor.call("kudosCount", id, function (err, result) {
    if(Meteor.userId() !== this._id) {
      Session.set(this._id + "kudos", result)
    }
  })
})

Template.profile.onRendered(function() {
  Meteor.call("kudosCount", Meteor.userId(), function(err, result) {
    console.log("KudosRefresh")
    Session.set("kudos", result)
  })
})

Template.profile.helpers({
  isOwnProfile: function() {
    //If logged-in userID === context ID
    return Meteor.userId() === this._id
  },
  ownYaks: function() {
    return Yaks.find({ creatorId: this._id }).fetch().reverse()
  },
  kudos: function() {
    if(Meteor.userId() === this._id) {
      return Session.get("kudos")
    }
    else {
      return Session.get(this._id + "kudos")
    }
  }
})
