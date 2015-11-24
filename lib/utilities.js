Meteor.utilities = {
  isMobile: function() {
    return Darwin.device.match('phone');
  },
  createTimeString: function(createdAt) {

    if (isNaN(createdAt)) { return 'Forever' }
    var diff = new Date().getTime() - new Date(createdAt).getTime();
    var diff = diff / (1000 * 3600);  //Returned in ms, 1000ms in a second, 3600s in an hour

    if (diff < 1.0) {  //If the difference is less than 1 hour
      return Math.round((diff * 60)) + 'm';
    }
    else {
      if (diff < 24.0) {  //If the diff is less than 24 hours
        return Math.round(diff) + 'h';
      }
      else {
        if (Math.round(diff / 24.0) > 7.0) {  //If diff / 24 is greater than 7 (days)
          return Math.round(diff / (24.0 * 7.0)) + 'w';
        }
        else {
          return Math.round(diff / 24.0) + 'd';  //Return in days
        }
      }
    }
  }
}
