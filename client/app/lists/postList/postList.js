Template.postList.events({
  'click #openPostBox': function(event, err) {
    $('#openPostBox').hide();
  },
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
});

Template.postList.onCreated(function() {
  if (Meteor.user()) {
    console.log('User');
    if (!("kudos" in Meteor.user())) {
      console.log('No kudos!');
      Meteor.call('transferAggKudosToUserKudos', Meteor.userId());
    }
  }
});

Template.postList.onDestroyed(function() {
  delete Session.keys['length'];  //Reset filter
});

Template.postList.onRendered(function() {
  window.scrollTo(0, 0)
  if (Meteor.utilities.isMobile()) {
    Session.set('disableDonateBanner', true);
  }

  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {
    Session.set('kudos', result);
  });
});

Template.postList.helpers({
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  posts: function() {
    if (Session.get('query') === 'mostRecent' || !Session.get('query')) {
      return Posts.find({}, { sort: { sticky: -1, createdAt: -1 }}).fetch();
    }
    else {
      return Posts.find({}, { sort: { sticky: -1, score: -1 }}).fetch();
    }
  }
});
