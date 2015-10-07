Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=body]');
    var comment = {
      text: $body.val(),
      postId: template.data._id,
      creatorId: Meteor.userId(),
      coords: {}
    };

    var commentBody = e.target.body.value;
    // Check if the comment is not empty
    if (comment.text == "") {
      alert("You can’t create an empty comment! Write something here instead. :)")
    } else {
      if(comment.text.length > 500) {
        alert("Please shorten your comment!");
      }
      else {
        navigator.geolocation.getCurrentPosition(function(position) {
          comment["coords"]["long"] = position.coords.longitude;
          comment["coords"]["lat"] = position.coords.latitude;

          Meteor.call('commentInsert', comment);

          delete Session.keys["length"];
        });
      }
    }

    // clear field
    e.target.body.value = "";
  },
  'keyup #body': function(e) {
    var length = $('#body').val().length;
    if(length > 500) {
      $('#submitButton').prop("disabled", true);
    }
    else {
      if($('#submitButton').prop("disabled")) {  //Submitingly-challenged is the PC term.
        $('#submitButton').prop("disabled", false);
      }
    }
    Session.set("length", length);

  },
  'mouseup #body': function(e) {
    var length = $('#body').val().length;
    if(length > 500) {
      $('#submitButton').prop("disabled", true);
    }
    else {
      if($('#submitButton').prop("disabled")) {  //Submitingly-challenged is the PC term.
        $('#submitButton').prop("disabled", false);
      }
    }
    Session.set("length", length);
  },
  'change #body': function(e) {
    var length = $('#body').val().length;
    if(length > 500) {
      $('#submitButton').prop("disabled", true);
    }
    else {
      if($('#submitButton').prop("disabled")) {  //Submitingly-challenged is the PC term.
        $('#submitButton').prop("disabled", false);
      }
    }
    Session.set("length", length);
  }
});

Template.commentSubmit.onCreated(function() {
  Session.set("length", 0);
});

Template.commentSubmit.helpers({
  length: function() {
    return Session.get("length");
  }
})
