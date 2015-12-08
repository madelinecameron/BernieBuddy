Posts = new Mongo.Collection("posts")
Comments = new Mongo.Collection("comments")
Towns = new Mongo.Collection("towns")
Articles = new Mongo.Collection("articles")
TemplatePics = new Mongo.Collection("template_pics")

Avatar.setOptions({
  imageSizes: {
    'profile': '120',  // in pixels
    'userbox': '65'
  }
})

if(Meteor.isServer) {
  Meteor.users.allow({
    update: function(id, doc, fields, modifer) {
      // Allow update if the field being updated is only kudos
      return (_.difference(fields, [ "kudos" ]).length === 0 || _.difference(fields, [ "kudos" ]).length === 0)
    }
  })

  Posts.allow({
    update: function(id, doc, fields, modifier) {
      // Allow update if the fields being updated are only score and upVoted or score and downvoted... or if the current user is an admin
      return (_.difference(fields, [ "score", "upVoted" ]).length === 0 || _.difference(fields, [ "score", "downVoted" ]).length === 0) || Meteor.user().isAdmin
    },
    remove: function(id, doc, fields, modifier) {
      // Allow delete if the post belongs to the current user or the current user is an admin
      return doc.creatorId === Meteor.userId() || Meteor.user().isAdmin
    }
  })

  Articles.allow({
    update: function(id, doc, fields, modifier) {
      // Allow update if the fields being updated are only score and upVoted or score and downvoted... or if the current user is an admin
      return (_.difference(fields, [ "score", "upVoted" ]).length === 0 || _.difference(fields, [ "score", "downVoted" ]).length === 0) || Meteor.user().isAdmin
    }
  })

  Comments.allow({
    update: function(id, doc, fields, modifier) {
      // Allow update if the fields being updated are only score and upVoted or score and downvoted... or if the current user is an admin
      return (_.difference(fields, [ "score", "upVoted" ]).length === 0 || _.difference(fields, [ "score", "downVoted" ]).length === 0) || Meteor.user().isAdmin
    },
    remove: function(id, doc, fields, modifier) {
      // Allow delete if the post belongs to the current user or the current user is an admin
      return doc.creatorId === Meteor.userId() || Meteor.user().isAdmin
    }
  })

  Towns._ensureIndex({ "location": "2dsphere" })  //Needed for geolocation

  Meteor.publish('emojis', function() {
    return Emojis.find()
  })

  Meteor.publish('profilePics', function() {
    // Those two fields are where profile picture URLs are stored
    return Meteor.users.find({}, { "services.twitter.profile_image_url_https": 1, "services.facebook.id": 1 })
  })

  Meteor.publish('users', function () {
    return Meteor.users.find({}, { 'profile.name': 1, 'isAdmin': 1 })
  })

  Meteor.publish('templatePics', function() {
    return TemplatePics.find({})
  })

  S3.config = {
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.DEBUG ? 'berniebuddydev' : 'berniebuddy'
  }
}

if(Meteor.isClient) {
  Meteor.startup(function() {
    Stripe.setPublishableKey("pk_live_mn0fBg4dTA6rlJUvpc20QGBi")
  })

  var subsCache = new SubsCache({
    expireAfter: 5,
    cacheLimit: 10
  })

  Meteor.subscribe("profilePics")
  Emojis.setBasePath('/Emojis')  // Path inside of /public so ./public/Emojis
  Meteor.subscribe('emojis')

  ShareIt.init({
    siteOrder: [ "facebook", "twitter" ],
    sites: {                // nested object for extra configurations
      'facebook': {
          'appId': '1810252865867865',
          'buttonText': 'Share'
      },
      'twitter': {
        'buttonText': 'Share'
      }
    },
    iconOnly: false,
    classes: 'btn-sm'
  })

  Deps.autorun(function() {
    subsCache.onReady(function() {
      subsCache.subscribe('users')
    })

    // A really, really, really bad way to auto-refresh kudos on each page load
    if(!Meteor.userId()) {
      if(Session.get("kudos")) {
        delete Session.keys["kudos"]
      }
    }
  })
}
