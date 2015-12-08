Template.insertTemplatePic.events({
  'click #insertTemplatePic': function(e) {
    e.preventDefault()

    var picName = $('#picName').val(),
        picUrl = $('#picUrl').val()

    if(picUrl !== "" && picName !== "") {
      Meteor.call('insertTemplatePic', picName, picUrl, function(err, result) {
        if(!err) {
          location.reload()
        }
        else {
          $('#errors').html("<p>" + err + "</p>")
        }
      })
    }
    else {
      $('#errors').html("<p>Please fill in all boxes</p>")
    }
  },
  'blur': function(e) {
    $('#errors').html('')
  }
})

Template.insertTemplatePic.onRendered(function() {
  if(!Meteor.user().isAdmin) {
    window.location.replace('/')  // Redirect
  }
})
