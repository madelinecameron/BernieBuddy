Template.state.helpers({
  posts: function() {
    if(Session.get("query") === "mostRecent" || !Session.get("query")) {
      return Posts.find({ location: this.state }).fetch().sort(function(a, b) {
        if(a.createdAt < b.createdAt) { return 1; }
        else { return -1; }
      });
    }
    else {
      return Posts.find({ location: this.state }, { sort: { sticky: -1, score: -1 }}).fetch().sort(function(a, b) {
        if(a.score < b.score) { return 1; }
        else { return -1; }
      });
    }
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
      var query = Session.get("query");
      query = targetId;

      Session.set("query", query);
    }
  }
});

Template.state.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {  //On render, re-request self kudo count
    Session.set('kudos', result);
  });
})
