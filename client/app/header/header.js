Template.header.helpers({
  isMobile: function() {
    console.log(Darwin.device.platform);
    console.log(Darwin.device.mobile);
    console.log(Darwin.device.match("phone"));
    return Darwin.device.match("phone");
  }
})
