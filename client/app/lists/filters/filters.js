Template.filters.events({
  'click .pagination li': function(event, err) {
    var targetId = event.target.id;
    var parent = $('#' + targetId).parent();

    if (!parent.hasClass('activeFilter')) {  //Filter not selected
      for (var index in parent.siblings()) {
        var siblingId = parent.siblings()[index].id;
        $('#' + siblingId).removeClass('activeFilter');
      }

      parent.addClass('activeFilter');
      parent.removeAttr('selected');
      parent.blur();

      var query = Session.get('query');
      query = targetId;

      Session.set('query', query);
    }
  }
})
