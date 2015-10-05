Template.yaksSubmit.events({
  'submit .yaksSubmitForm': function(event,err) {

    event.preventDefault();

    var yakItem = {};
    yakItem["yak"] = event.target.yak.value; 		// get text
    yakItem["creatorId"] = Meteor.userId();
    yakItem["coords"] = {};

    console.log("Go");
    if (yakItem["yak"] == "") {
      alert("You can't insert empty yak. Try to write something funny instead! :)");
      return;
    }

    if(yakItem["yak"].length > 500) {
      alert("Please make your posting shorter");
      return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      yakItem["coords"]["long"] = position.coords.longitude;
      yakItem["coords"]["lat"] = position.coords.latitude;

      Meteor.call('yakInsert', yakItem);
      /*post._id = Yaks.insert(post);*/
      $('#openYakBox').show("slow");
    });

    /*var post= {
      yak: $(event.target).find('[name=yak]').val(),
      submitted : new Date(),
      score : 0
    }*/


  }
});
