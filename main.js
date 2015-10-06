Yaks = new Mongo.Collection("yaks");
Comments = new Mongo.Collection("comments");
Towns = new Mongo.Collection("towns");

if(Meteor.isServer) {
  Towns._ensureIndex({ 'location': '2dsphere' });

  Meteor.publish('profilePics', function() {
    return Meteor.users.find({}, { "services.twitter.profile_image_url_https": 1, "services.facebook.id": 1 })
  });
}

if(Meteor.isClient) {
  Meteor.subscribe('profilePics');

  Deps.autorun(function() {
    if(!Meteor.userId()) {
      if(Session.get("karma")) {
        delete Session.keys["karma"];
      }
    }
  });
}
// comments
