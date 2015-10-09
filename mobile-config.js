// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.berniebuddy',
  name: 'BernieBuddy',
  description: 'Feel the Bern',
  author: 'Madeline Cameron @ BernieBuddy',
  email: 'admin@berniebuddy.com',
  website: 'http://berniebuddy.com'
});

App.accessRule("https://graph.facebook.com/*");
App.accessRule("https://pbs.twimg.com/*");
App.accessRule("*.bootstrapcdn.com/*");

// Pass preferences for a particular PhoneGap/Cordova plugin
App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '1234567890',
  API_KEY: 'supersecretapikey'
});
