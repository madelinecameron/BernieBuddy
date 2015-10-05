Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=body]');
    var comment = {
      text: $body.val(),
      postId: template.data._id,
      creatorId: Meteor.userId()
    };

    var commentBody = e.target.body.value;
    // Check if the comment is not empty
    if (comment.text == "") {
      alert("You can't insert empty comment. Try to comment something nice instead! :)")
    } else {
      if(comment.text.length > 500) { alert("Please shorten your comment!"); }
      else {
        Meteor.call('commentInsert', comment);
      }
    }

    // clear field
    e.target.body.value = "";
  }
});
