if (Meteor.isServer) {
  Meteor.publish('yaks', function(limit) {
    return Yaks.find({ active: true }, { limit: limit });
  });
} else if (Meteor.isClient) {
  var YAKS_INCREMENT = 20;
  Session.setDefault('yaksLimit', YAKS_INCREMENT);
  Deps.autorun(function() {
    Meteor.subscribe('yaks', Session.get('yaksLimit'));
  });
}
