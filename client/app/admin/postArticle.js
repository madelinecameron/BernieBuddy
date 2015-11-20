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
      articlePic = $('#templateArticlePic :selected').attr('id')
    }

    if(articleUrl !== "" && articlePic !== "" && articleSummary !== "") {
      Meteor.call('postArticle', articleUrl, articlePic, articleSummary, function(err, result) {
        if(!err) {
          location.reload()
        }
        else {
          $('#errors').html("<p>" + err + "</p>")
        }
      });
    }
    else {
      $('#errors').html("<p>Please fill in all boxes</p>")
    }
  },
  'blur': function(e) {
    $('#errors').html('')
  }
})

Template.postArticle.onCreated(function() {
  Meteor.subscribe('templatePics')
})
Template.postArticle.onRendered(function() {
  if(!Meteor.user().isAdmin) {
    window.location.replace('/');  //Redirect
  }
})

Template.postArticle.helpers({
  'templatePics': function() {
    console.log(TemplatePics.find({}).fetch())
    return TemplatePics.find({}).fetch();
  }
})
