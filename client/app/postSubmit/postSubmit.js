var photoLoc = null;

Template.postSubmit.events({
  'keydown #submitPostText': function(event, err) {
    var keyCode = event.which;
    if (keyCode == 13 && !event.shiftKey)  //If enter pressed and not also shift
    {
        $('#postBox').collapse('hide');
        $('.postSubmitForm').submit();
    }
  },
  'submit .postSubmitForm': function(event, err) {

    event.preventDefault();

    var postItem = {};
    postItem['post'] = event.target.submitPostText.value; 		// get text
    postItem['creatorId'] = Meteor.userId();
    postItem['coords'] = {};
    postItem['anonymous'] = false;
    postItem['sticky'] = false;
    postItem['adminPost'] = false;

    if ($('#file')[0].files[0]) {
      console.log('File uploaded');
      console.log(photoLoc);
      postItem['photoLoc'] = photoLoc;
    }

    if ($('#postAnon').prop('checked') || !postItem['creatorId']) {
      postItem['anonymous'] = true;
    }
    if ($('#postAsAdmin').prop('checked')) {
      postItem['sticky'] = true;
      postItem['adminPost'] = true;
    }

    if (postItem['post'] == '') {
      alert('You can’t create an empty post! Write something here instead. :)')

      delete Session.keys['length'];

      return;
    }

    if (postItem['post'].length > 500) {
      alert('Please make your post shorter')

      delete Session.keys['length'];
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        postItem['coords']['long'] = position.coords.longitude;
        postItem['coords']['lat'] = position.coords.latitude;

        Meteor.call('postInsert', postItem)

        delete Session.keys['length'];

        $('#openPostBox').show('slow');
      }, function() {
        postItem['coords']['long'] = 0;
        postItem['coords']['lat'] = 0;

        Meteor.call('postInsert', postItem)

        delete Session.keys['length'];

        $('#openPostBox').show('slow');
      });
    }
    else {
      postItem['coords']['long'] = 0;
      postItem['coords']['lat'] = 0;

      Meteor.call('postInsert', postItem)

      delete Session.keys['length'];
      $('#openPostBox').show('slow');
    }

    $('.postSubmitForm').trigger('reset');
    $('#submitPostText').val('').blur();
    S3.collection.remove({});

  },
  'keyup #submitPostText': function(e) {
    var length = $('#submitPostText').val().length;
    if (length > 500 || length == 0) {
      $('#submitButton').prop('disabled', true);
    }
    else {
      if ($('#submitButton').prop('disabled')) {  //Submitingly-challenged is the PC term.
        $('#submitButton').prop('disabled', false);
      }
    }
    Session.set('length', length);
  },
  'mouseup #submitPostText': function(e) {
    var length = $('#submitPostText').val().length;
    if (length > 500 || length == 0) {
      $('#submitButton').prop('disabled', true);
    }
    else {
      if ($('#submitButton').prop('disabled')) {  //Submitingly-challenged is the PC term.
        $('#submitButton').prop('disabled', false);
      }
    }
    Session.set('length', length);
  },
  'change #submitPostText': function(e) {
    var length = $('#submitPostText').val().length;
    if (length > 500 || length == 0) {
      $('#submitButton').prop('disabled', true);
    }
    else {
      if ($('#submitButton').prop('disabled')) {  //Submitingly-challenged is the PC term.
        $('#submitButton').prop('disabled', false);
      }
    }
    Session.set('length', length);
  },
  'change #file': function() {  //On selection of file
    var file = $('#file')[0].files;

    console.log(file);

    S3.upload({
            files: file
        }, function(error, result) {
          photoLoc = result.secure_url;
    });
  },
  'click #isImagePost': function() {
    $('#fileUpload').toggle();
  }
});

Template.postSubmit.onCreated(function() {
  Session.set('length', 0);
});

Template.postSubmit.helpers({
  length: function() {
    return Session.get('length');
  },
  files: function() {
    var photo = S3.collection.find().fetch();
    if (photo.length > 0) {
      if (photo[0].percent_uploaded < 100) {
        $('#submitButton').prop('disabled', true);
      }
      else {
        $('#submitButton').prop('disabled', false);
      }
    }

    return photo;
  }
});
