Template.yaksSubmit.events({
  'submit .yaksSubmitForm': function(event,err) {

    event.preventDefault();

    var yakItem = {};
    yakItem["yak"] = event.target.yak.value; 		// get text
    yakItem["creatorId"] = Meteor.userId();
    yakItem["coords"] = {};
    yakItem["anonymous"] = false;
    yakItem["sticky"] = false;
    yakItem["adminPost"] = false;

    if($("#postAnon").prop("checked")) {
      yakItem["anonymous"] = true;
    }
    if($("#postAsAdmin").prop("checked")) {
      yakItem["sticky"] = true;
      yakItem["adminPost"] = true;
    }

    if (yakItem["yak"] == "") {
      alert("You can’t create an empty post! Write something here instead. :)");

      delete Session.keys["length"];

      return;
    }

    if(yakItem["yak"].length > 500) {
      alert("Please make your post shorter");

      delete Session.keys["length"];
    }

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        yakItem["coords"]["long"] = position.coords.longitude;
        yakItem["coords"]["lat"] = position.coords.latitude;

        Meteor.call('yakInsert', yakItem);

        delete Session.keys["length"];
        $(event.target.yak).val('');

        $('#openYakBox').show("slow");
      }, function() {
        yakItem["coords"]["long"] = 0;
        yakItem["coords"]["lat"] = 0;

        Meteor.call('yakInsert', yakItem);

        delete Session.keys["length"];
        $(event.target.yak).val('');  //Clear text box

        $('#openYakBox').show("slow");
      });
    }
    else {
      yakItem["coords"]["long"] = 0;
      yakItem["coords"]["lat"] = 0;

      Meteor.call('yakInsert', yakItem);

      delete Session.keys["length"];
      $(event.target.yak).val('');  //Clear text box

      $('#openYakBox').show("slow");
    }

  },
  'keyup #yak': function(e) {
    var length = $('#yak').val().length;
    if(length > 500 || length == 0) {
      $('#submitButton').prop("disabled", true);
    }
    else {
      if($('#submitButton').prop("disabled")) {  //Submitingly-challenged is the PC term.
        $('#submitButton').prop("disabled", false);
      }
    }
    Session.set("length", length);
  },
  'mouseup #yak': function(e) {
    var length = $('#yak').val().length;
    if(length > 500 || length == 0) {
      $('#submitButton').prop("disabled", true);
    }
    else {
      if($('#submitButton').prop("disabled")) {  //Submitingly-challenged is the PC term.
        $('#submitButton').prop("disabled", false);
      }
    }
    Session.set("length", length);
  },
  'change #yak': function(e) {
    var length = $('#yak').val().length;
    if(length > 500 || length == 0) {
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

Template.yaksSubmit.onCreated(function() {
  Session.set("length", 0);
});

Template.yaksSubmit.helpers({
  length: function() {
    return Session.get("length");
  }
})
