Router.route('/', {name: 'yaksList'})

Router.route('/submit', {name: 'yaksSubmit'});

Router.route('/login', {name: 'accounts'});

Router.route('/logout', function() {
  var res = this.response;

  Meteor.logout(function(err) {
    if(err) {
      console.error(err);
      res.send(err);
    }

    Router.go('/');
  });
});

Router.route('/yaks/:_id', {
  name: 'yakPage',
  waitOn: function() {
    return Meteor.subscribe('yaks');
  },
  data: function() {
    if(this.ready()) {
      return Yaks.findOne(this.params._id);
    }
  }
});

Router.route('/profile/:_id', {
  name: 'profile',
  data: function() {
    return Meteor.users.findOne(this.params._id);
  }
});
