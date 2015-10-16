Template.header.helpers({
  isMobile: function() {
    return Darwin.device.match("phone");
  },
  disableDonate: function() {
    return Session.get("disableDonateBanner");
  }
});
