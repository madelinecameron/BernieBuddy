Template.state.helpers({
  yaks: function() {
    if(Session.get("filterMethod") === "Recent" || !Session.get("filterMethod")) {
      return Yaks.find().fetch().reverse();
    }
    else {
      return Yaks.find({}, { sort: { score: -1 }}).fetch();
    }
  },
  moreResults: function() {
      // If, once the subscription is ready, we have less rows than we
      // asked for, we've got all the rows in the collection.
      return !(Yaks.find({ location: this.state }).count() < Session.get("yaksLimit")) && Session.get("yaksLimit") < 250;
  },
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
})

Template.state.onCreated(function() {
  setTimeout(function() {  //Silly 250ms delay to allow subscriptions to come in
    console.log("Loaded");
  }, 250);
});

Template.state.onRendered(function() {
  Meteor.call('kudosCount', Meteor.userId(), function(err, result) {  //On render, re-request self kudo count
    Session.set('kudos', result);
  });
})

// whenever #showMoreResults becomes visible, retrieve more results
function showMoreVisible() {
    var threshold, target = $("#showMoreResults");
    var YAKS_INCREMENT = 20;
    if (!target.length) return;

    threshold = $(window).scrollTop() + $(window).height() - target.height();

    if (target.offset().top < threshold) {
        if (!target.data("visible")) {
            // console.log("target became visible (inside viewable area)");
            target.data("visible", true);
            Session.set("yaksLimit",
                Session.get("yaksLimit") + YAKS_INCREMENT);
        }
    } else {
        if (target.data("visible")) {
            // console.log("target became invisible (below viewable arae)");
            target.data("visible", false);
        }
    }
}

// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);

function loadMore(opts) {
  var force = opts.force || false;
  var threshold, target = $('body');
  if (!target.length) return;

  threshold = $(window).scrollTop() + $(window).height() - target.height();

  // HACK: see http://www.meteorpedia.com/read/Infinite_Scrolling
  if (force || target.offset().top < threshold+1 && threshold < 2) {
    console.log("OFF:"+ target.offset().top +" TR:"+  threshold +" ST:"+$(window).scrollTop() +" WH:"+ $(window).height());
    var query = Session.get('query');
    console.log(query);
    Session.set('query', { filterTitle:query.filterTitle, page:query.page + 1})
  }
}

// init
Meteor.startup(function (argument) {
  Session.setDefault('query', {filterTitle:undefined, page:1})
  $(window).scroll(loadMore);
});
