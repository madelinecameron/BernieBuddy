Template.yaksList.helpers({
  yaks: function() {
    return Yaks.find().fetch().reverse();
  },
  moreResults: function() {
      // If, once the subscription is ready, we have less rows than we
      // asked for, we've got all the rows in the collection.
      return !(Yaks.find().count() < Session.get("yaksLimit")) && Session.get("yaksLimit") < 250;
  }
});

Template.yaksList.events({
  'click #openYakBox': function(event, err) {
    console.log("Hide!")
    $('#openYakBox').hide();
  }
});

// whenever #showMoreResults becomes visible, retrieve more results
function showMoreVisible() {
    var threshold, target = $("#showMoreResults");
    if (!target.length) return;

    threshold = $(window).scrollTop() + $(window).height() - target.height();

    if (target.offset().top < threshold) {
        if (!target.data("visible")) {
            // console.log("target became visible (inside viewable area)");
            target.data("visible", true);
            Session.set("yaksList",
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
    Session.set('query', { filterTitle:query.filterTitle ,page:query.page+1})
  }
}

// init
Meteor.startup(function (argument) {
  Session.setDefault('query', {filterTitle:undefined, page:1})
  $(window).scroll(loadMore);
})
