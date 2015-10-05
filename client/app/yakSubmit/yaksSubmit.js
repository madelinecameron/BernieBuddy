Template.yaksSubmit.events({
	'submit .yaksSubmitForm': function(event,err) {

		event.preventDefault();

		var yakItem = {};
		yakItem["yak"] = event.target.yak.value; 		// get text
		yakItem["creatorId"] = Meteor.userId();
		yakItem["loc"] = null  //TO DO: Implement location

		// check if the value is empty
		if (yakItem["yak"] == "") {
			alert("You can't insert empty yak. Try to write something funny instead! :)");
		} else {
			if(yakItem["yak"].length > 200) { alert("Please make your posting shorter"); }
			else {
				Meteor.call('yakInsert', yakItem);
				/*post._id = Yaks.insert(post);*/
				Router.go('yaksList');
			}
		}

		/*var post= {
			yak: $(event.target).find('[name=yak]').val(),
			submitted : new Date(),
			score : 0
		}*/


	}
});
