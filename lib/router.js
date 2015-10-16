Router.route('/', {name: 'postList'})

Router.route('/submit', {name: 'postSubmit'});

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

Router.route('/donate', {
  name: 'donate',
  data: function() {
    return { onDonate: true };
  }
});

Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return Meteor.subscribe('posts');
  },
  data: function() {
    if(this.ready()) {
      return Posts.findOne(this.params._id);
    }
  }
});

Router.route('/profile/:_id', {
  name: 'profile',
  data: function() {
    return { _id: this.params._id }
  }
});

Router.route('/location/:state', {
  name: 'state',
  data: function() {
    return { state: this.params.state }
  }
});
