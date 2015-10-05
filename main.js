Yaks = new Mongo.Collection("yaks");
Comments = new Mongo.Collection("comments");
Towns = new Mongo.Collection("towns");

if(Meteor.isServer) {
  Towns._ensureIndex({ 'location':'2dsphere' });
}
// comments
