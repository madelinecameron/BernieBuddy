Posts = new Mongo.Collection("posts");
Comments = new Mongo.Collection("comments");
Towns = new Mongo.Collection("towns");

if(Meteor.isServer) {
  Meteor.users.deny({
    update: function() {
      return true;
    }
  });

  Towns._ensureIndex({ 'location': '2dsphere' });

  Meteor.publish('profilePics', function() {
    return Meteor.users.find({}, { "services.twitter.profile_image_url_https": 1, "services.facebook.id": 1 })
  });
}

if(Meteor.isClient) {
  Meteor.subscribe('profilePics');

  Deps.autorun(function() {
    if(!Meteor.userId()) {
      if(Session.get("kudos")) {
        delete Session.keys["kudos"];
      }
    }
  });
}
