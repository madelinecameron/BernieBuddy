Template.filters.events({
  'click .pagination li': function(event, err) {
    var targetId = event.target.id
    var parent = $('#' + targetId).parent()

    if (!parent.hasClass('activeFilter')) {  // Filter not selected
      for (var index in parent.siblings()) {
        var siblingId = parent.siblings()[index].id
        $('#' + siblingId).removeClass('activeFilter')
      }

      parent.addClass('activeFilter')  // Shows what filter is selected
      parent.removeAttr('selected')  // Stops selected filter from being greyed due to being :active
      parent.blur()  // De-select filter so it stops being :active

      var query = Session.get('query')
      query = targetId  // Set query to the id of the filter button ('mostRecent' or 'mostPopular')

      Session.set('query', query)
    }
  }
})
