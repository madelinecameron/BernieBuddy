Posts = new Mongo.Collection("posts")
Comments = new Mongo.Collection("comments")
Towns = new Mongo.Collection("towns")

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

if(Meteor.isCordova) {
  var donationTiers = [
    { "$1": "50" },
    { "$3": "150" },
    { "$5": "250" },
    { "$10": "500" },
    { "$20": "1000" },
    { "$50": "2500" },
    { "$100": "5000" }
  ]
  _.each(donationTiers, function(item) {
    var key = Object.keys(item)[0]
    store.register({
      id: "berniebuddy." + item[key],
      alias: key + " donation for " + item[key] + " kudos",
      type: store.CONSUMABLE
    })
  })
}

if(Meteor.isClient) {
  Meteor.subscribe("profilePics")

  Deps.autorun(function() {
    if(!Meteor.userId()) {
      if(Session.get("kudos")) {
        delete Session.keys["kudos"]
      }
    }
  })
}
