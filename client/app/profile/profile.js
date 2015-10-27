Template.profile.events({
  'click .pagination li': function(event, err) {
    var targetId = event.target.id;
    var parent = $('#' + targetId).parent();

    if (!parent.hasClass('activeFilter')) {  //Filter not selected
      for (var index in parent.siblings()) {
        var siblingId = parent.siblings()[index].id;
        $('#' + siblingId).removeClass('activeFilter');
      }

      parent.addClass('activeFilter');
      parent.removeAttr('selected');

      var query = Session.get('query');
      query = targetId;

      Session.set('query', query);
    }
  }
})

Template.profile.onCreated(function() {
  var id = this.data._id;
  Meteor.call('kudosCount', id, function(err, result) {
    if (Meteor.userId() !== this._id) {
      Session.set(this._id + 'kudos', result);
    }
  });
});

Template.profile.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result);
  });
});

Template.profile.onDestroyed(function() {
  delete Session.keys.length;  //Reset filter
});

Template.profile.helpers({
  isOwnProfile: function() {
    //If logged-in userID === context ID
    return Meteor.userId() === this._id;
  },
  posts: function() {
    if (Session.get('query') === 'mostRecent' || !Session.get('query')) {
      return Posts.find({ creatorId: this._id }, { sort: { sticky: -1, createdAt: -1 }}).fetch();
    }
    else {
      return Posts.find({ creatorId: this._id }, { sort: { sticky: -1, score: -1 }}).fetch();
    }
  },
  kudos: function() {
    if (Meteor.userId() === this._id) {
      return Session.get('kudos');
    }
    else {
      return Session.get(this._id + 'kudos');
    }
  }
});
