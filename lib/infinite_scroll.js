var YAKS_INCREMENT = 20;

if (Meteor.isServer) {
  Meteor.publish('yaks', function(limit) {
    return Yaks.find({ }, { limit: 150 });
  });
} else if (Meteor.isClient) {
  Session.setDefault('yaksLimit', YAKS_INCREMENT);
  Deps.autorun(function() {
    Meteor.subscribe('yaks', 150);
  });
}
