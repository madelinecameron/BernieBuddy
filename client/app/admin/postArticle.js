Template.postArticle.events({
  'click #postArticleBtn': function(e) {
    e.preventDefault();

    var articleUrl = $('#articleUrl').val(),
        articlePic = "",
        articleSummary = $('#articleExcerpt').val();

    if($('#articlePic').val() !== "") {
      articlePic = $('#articlePic').val()
    }
    else {
      articlePic = $('#templateArticlePic :selected').id()
    }

    Meteor.call('postArticle', articleUrl, articlePic, articleSummary, function(err, result) {
      console.log(err)
      console.log(result)
    });
  }
})

Template.postArticle.onCreated(function() {
  if(!Meteor.user().isAdmin) {
    window.location.replace('/');  //Redirect
  }
})
