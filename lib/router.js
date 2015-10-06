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
  data: function() {
    return Yaks.findOne(this.params._id);
  }
});

Router.route('/profile/:_id', {
  name: 'profile',
  data: function() {
    return Meteor.users.findOne(this.params._id);
  }
});
