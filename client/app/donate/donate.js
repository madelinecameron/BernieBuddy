Template.donate.onCreated(function() {
  Session.set("disableDonateBanner", true);
});

Template.donate.onDestroyed(function() {
  Session.set("disableDonateBanner", false);
});
