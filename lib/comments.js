if (Meteor.isServer) {
  Meteor.publish('comments', function() {
    return Comments.find({})
  })
} else if (Meteor.isClient) {
  Deps.autorun(function() {  // Auto subscribe to comments so they appear instantly
    Meteor.subscribe('comments')
  })
}
