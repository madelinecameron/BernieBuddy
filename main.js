Posts = new Mongo.Collection("posts")
Comments = new Mongo.Collection("comments")
Towns = new Mongo.Collection("towns")
//Fiber = Meteor.require('fibers')

if(Meteor.isServer) {
  Meteor.users.deny({
    update: function() {
      return true
    }
  })

  Posts.allow({
    update: function(id, doc, fields, modifier) {
      return (_.difference(fields, [ "score", "upVoted" ]).length === 0 || _.difference(fields, [ "score", "downVoted" ]).length === 0) || Meteor.user().isAdmin
    },
    remove: function(id, doc, fields, modifier) {
      return doc.creatorId === Meteor.userId() || Meteor.user().isAdmin
    }
  })

  Towns._ensureIndex({ "location": "2dsphere" })

  Meteor.publish("profilePics", function() {
    return Meteor.users.find({}, { "services.twitter.profile_image_url_https": 1, "services.facebook.id": 1 })
  })
}

if(Meteor.isClient) {
  Meteor.startup(function() {
    Stripe.setPublishableKey('pk_test_OGnwLaTmq3rbvcfIQNFZefBh')
  })

  Meteor.subscribe("profilePics")

  Deps.autorun(function() {
    if(!Meteor.userId()) {
      if(Session.get("kudos")) {
        delete Session.keys["kudos"]
      }
    }
  })
}
