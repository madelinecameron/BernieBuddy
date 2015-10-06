Template.yaksSubmit.events({
  'submit .yaksSubmitForm': function(event,err) {

    event.preventDefault();

    var yakItem = {};
    yakItem["yak"] = event.target.yak.value; 		// get text
    yakItem["creatorId"] = Meteor.userId();
    yakItem["coords"] = {};

    console.log("Go");
    if (yakItem["yak"] == "") {
      alert("You can't insert empty post. Try to write something funny instead! :)");
      return;
    }

    if(yakItem["yak"].length > 500) {
      alert("Please make your post shorter");
      return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      yakItem["coords"]["long"] = position.coords.longitude;
      yakItem["coords"]["lat"] = position.coords.latitude;

      Meteor.call('yakInsert', yakItem);

      delete Session.keys["length"];

      /*post._id = Yaks.insert(post);*/
      $('#openYakBox').show("slow");
    });
  },
  'keyup #yak': function(e) {
    var length = $('#yak').val().length;
    Session.set("length", length);
  },
  'mouseup #yak': function(e) {
    var length = $('#yak').val().length;
    Session.set("length", length);
  },
  'change #yak': function(e) {
    var length = $('#yak').val().length;
    Session.set("length", length);
  }
});

Template.yakSubmit.onCreated(function() {
  Session.set("length", 0);
});

Template.yakSubmit.helpers({
  length: function() {
    return Session.get("length");
  }
})
