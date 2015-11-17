Posts = new Mongo.Collection("posts")
Comments = new Mongo.Collection("comments")
Towns = new Mongo.Collection("towns")

Avatar.setOptions({
  imageSizes: {
    'profile': '120',
    'userbox': '65'
  }
})

if(Meteor.isServer) {
  Meteor.users.allow({
    update: function(id, doc, fields, modifer) {
      return (_.difference(fields, [ "kudos" ]).length === 0 || _.difference(fields, [ "kudos" ]).length === 0)
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

  Comments.allow({
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

  Meteor.publish('emojis', function() {
    return Emojis.find();
  });

  S3.config = {
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.DEBUG ? 'berniebuddydev' : 'berniebuddy'
  };
}

if(Meteor.isClient) {
  Meteor.startup(function() {
    Stripe.setPublishableKey("pk_live_mn0fBg4dTA6rlJUvpc20QGBi")
  })

  Meteor.subscribe("profilePics")
  Emojis.setBasePath('/Emojis')
  Meteor.subscribe('emojis');
  
  Deps.autorun(function() {
    if(!Meteor.userId()) {
      if(Session.get("kudos")) {
        delete Session.keys["kudos"]
      }
    }
  })
}
