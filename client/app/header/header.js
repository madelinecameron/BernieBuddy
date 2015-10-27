Template.header.helpers({
  isMobile: function() {
    console.log(Darwin.device);
    return Darwin.device.type === "phone"  //Don't ask. The traditional way doesn't work.
  },
  disableDonate: function() {
    return Session.get('disableDonateBanner');
  }
});
