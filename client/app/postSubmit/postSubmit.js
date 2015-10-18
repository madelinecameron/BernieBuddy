Template.postSubmit.events({
  "submit .postSubmitForm": function(event, err) {

    event.preventDefault()

    var postItem = {}
    postItem["post"] = event.target.submitPostText.value 		// get text
    postItem["creatorId"] = Meteor.userId()
    postItem["coords"] = {}
    postItem["anonymous"] = false
    postItem["sticky"] = false
    postItem["adminPost"] = false

    if($("#postAnon").prop("checked") || !postItem["creatorId"]) {
      postItem["anonymous"] = true
    }
    if($("#postAsAdmin").prop("checked")) {
      postItem["sticky"] = true
      postItem["adminPost"] = true
    }

    if (postItem["post"] == "") {
      alert("You can’t create an empty post! Write something here instead. :)")

      delete Session.keys["length"]

      return
    }

    if(postItem["post"].length > 500) {
      alert("Please make your post shorter")

      delete Session.keys["length"]
    }

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        postItem["coords"]["long"] = position.coords.longitude
        postItem["coords"]["lat"] = position.coords.latitude

        Meteor.call("postInsert", postItem)

        delete Session.keys["length"]
        $(event.target.post).val("")

        $("#openPostBox").show("slow")
      }, function() {
        postItem["coords"]["long"] = 0
        postItem["coords"]["lat"] = 0

        Meteor.call("postInsert", postItem)

        delete Session.keys["length"]
        $(event.target.post).val("")  //Clear text box

        $("#openPostBox").show("slow")
      })
    }
    else {
      postItem["coords"]["long"] = 0
      postItem["coords"]["lat"] = 0

      Meteor.call("postInsert", postItem)

      delete Session.keys["length"]
      $(event.target.post).val("")  //Clear text box

      $("#openPostBox").show("slow")
    }

  },
  "keyup #submitPostText": function(e) {
    var length = $("#submitPostText").val().length
    if(length > 500 || length == 0) {
      $("#submitButton").prop("disabled", true)
    }
    else {
      if($("#submitButton").prop("disabled")) {  //Submitingly-challenged is the PC term.
        $("#submitButton").prop("disabled", false)
      }
    }
    Session.set("length", length)
  },
  "mouseup #submitPostText": function(e) {
    var length = $("#submitPostText").val().length
    if(length > 500 || length == 0) {
      $("#submitButton").prop("disabled", true)
    }
    else {
      if($("#submitButton").prop("disabled")) {  //Submitingly-challenged is the PC term.
        $("#submitButton").prop("disabled", false)
      }
    }
    Session.set("length", length)
  },
  "change #submitPostText": function(e) {
    var length = $("#submitPostText").val().length
    if(length > 500 || length == 0) {
      $("#submitButton").prop("disabled", true)
    }
    else {
      if($("#submitButton").prop("disabled")) {  //Submitingly-challenged is the PC term.
        $("#submitButton").prop("disabled", false)
      }
    }
    Session.set("length", length)
  }
})

Template.postSubmit.onCreated(function() {
  Session.set("length", 0)
})

Template.postSubmit.helpers({
  length: function() {
    return Session.get("length")
  }
})
