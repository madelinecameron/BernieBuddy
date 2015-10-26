Template.header.helpers({
  isMobile: function() {
    return Darwin.device.type === 'phone';
  },
  disableDonate: function() {
    return Session.get('disableDonateBanner');
  }
});
