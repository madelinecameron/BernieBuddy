Template.state.helpers({
  yaks: function() {
    if(Session.get("query") === "mostRecent" || !Session.get("query")) {
      return Posts.find().fetch().reverse();
    }
    else {
      return Posts.find({}, { sort: { score: -1 }}).fetch();
    }
  }
  fullStateName: function() {
    return "Missouri"; //Temporary
  }
});

Template.state.events({
  "click .pagination li": function(event, err) {
    var targetId = event.target.id;
    var parent = $("#" + targetId).parent();

    if(!parent.hasClass("activeFilter")) {  //Filter not selected
      for(var index in parent.siblings()) {
        var siblingId = parent.siblings()[index].id;
        $("#" + siblingId).removeClass("activeFilter");
      }

      parent.addClass("activeFilter");
      parent.removeAttr("selected");

      //Setting the filters in Session allows reactive update
      switch(targetId) {
        case "mostRecent":
          Session.set("filterMethod", "Recent");
          break;
        case "mostPopular":
          Session.set("filterMethod", "Popular");
          break;
      }
    }
  }
});

Template.state.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {  //On render, re-request self kudo count
    Session.set('kudos', result);
  });
})
