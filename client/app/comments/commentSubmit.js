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
      alert("You can't insert empty comment. Try to comment something nice instead! :)")
    } else {
      if(comment.text.length > 500) { alert("Please shorten your comment!"); }
      else {
        navigator.geolocation.getCurrentPosition(function(position) {
          comment["coords"]["long"] = position.coords.longitude;
          comment["coords"]["lat"] = position.coords.latitude;

          Meteor.call('commentInsert', comment);

          delete Session.keys["length"];
        });

        delete Session.keys["length"];
      }
    }

    // clear field
    e.target.body.value = "";
  },
  'keyup #body': function(e) {
    var length = $('#body').val().length;
    Session.set("length", length);

  },
  'mouseup #body': function(e) {
    var length = $('#body').val().length;
    Session.set("length", length);
  },
  'change #body': function(e) {
    var length = $('#body').val().length;
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
