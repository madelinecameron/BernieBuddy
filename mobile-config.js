// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.berniebuddy',
  name: 'Bernie Buddy',
  description: 'Feel the Bern',
  author: 'Madeline Cameron @ Bernie Buddy',
  email: 'admin@berniebuddy.com',
  website: 'http://berniebuddy.com',
  version: '0.0.4'
})

App.icons({
  'iphone': 'public/iOS/icons/Icon.png',
  'iphone_2x': 'public/iOS/icons/Icon@2x.png',
  'ipad': 'public/iOS/icons/Icon-76.png',
  'android_ldpi': 'public/Android/drawable-ldpi/icon.png',
  'android_mdpi': 'public/Android/drawable-mdpi/icon.png',
  'android_hdpi': 'public/Android//drawable-hdpi/icon.png',
  'android_xhdpi': 'public/Android//drawable-xhdpi/icon.png'
})

App.launchScreens({
  'iphone': 'public/iOS/splash/Default~iphone.png',
  'iphone_2x': 'public/iOS/splash/Default-568h@2x~iphone_640x1136.png',
  'iphone5': 'public/iOS/splash/Default~iphone.png',
  'iphone6': 'public/iOS/splash/Default-750@2x~iphone6-portrait_750x1334.png',
  'iphone6p_portrait': 'public/iOS/splash/Default-1242@3x~iphone6s-portrait_1242x2208.png',
  'iphone6p_landscape': 'public/iOS/splash/Default-1242@3x~iphone6s-landscape_2208x1242.png',
  'ipad_portrait': 'public/iOS/splash/Default-Portrait~ipad_768x1024.png',
  'ipad_portrait_2x': 'public/iOS/splash/Default-Portrait@2x~ipad_1536x2048.png',
  'ipad_landscape': 'public/iOS/splash/Default-Landscape~ipad_1024x768.png',
  'ipad_landscape_2x': 'public/iOS/splash/Default-Landscape@2x~ipad_2048x1536.png',
  'android_mdpi_portrait': 'public/Android/drawable-mdpi/screen.png',
  'android_mdpi_landscape': 'public/Android/drawable-land-mdpi/screen.png',
  'android_hdpi_portrait': 'public/Android/drawable-hdpi/screen.png',
  'android_hdpi_landscape': 'public/Android/drawable-land-hdpi/screen.png',
  'android_xhdpi_portrait': 'public/Android/drawable-xhdpi/screen.png',
  'android_xhdpi_landscape': 'public/Android/drawable-land-xhdpi/screen.png'
})

App.setPreference('android-versionCode', '4')

App.accessRule('https://graph.facebook.com/*')
App.accessRule('https://pbs.twimg.com/*')
App.accessRule('*.bootstrapcdn.com/*')
App.accessRule('https://s3.amazonaws.com/berniebuddydev')
App.accessRule('https://s3.amazonaws.com/berniebuddydev*')
App.accessRule('https://s3.amazonaws.com/berniebuddydev/*')
App.accessRule('https://s3.amazonaws.com/berniebuddy')
App.accessRule('https://s3.amazonaws.com/berniebuddy*')
App.accessRule('https://s3.amazonaws.com/berniebuddy/*')
App.accessRule('https://*.stripe.com/*')
