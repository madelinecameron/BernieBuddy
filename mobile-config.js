// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.berniebuddy',
  name: 'Bernie Buddy',
  description: 'Feel the Bern',
  author: 'Madeline Cameron @ Bernie Buddy',
  email: 'admin@berniebuddy.com',
  website: 'http://berniebuddy.com'
});

App.icons({
  'iphone': 'public/iOS/icons/Icon.png',
  'iphone_2x': 'public/iOS/icons/Icon@2x.png',
  'ipad': 'public/iOS/icons/Icon-76.png',
  'android_ldpi': 'public/Android/drawable-ldpi/icon.png',
  'android_mdpi': 'public/Android/drawable-mdpi/icon.png',
  'android_hdpi': 'public/Android//drawable-hdpi/icon.png',
  'android_xhdpi': 'public/Android//drawable-xhdpi/icon.png'
});

App.configurePlugin('cc.fovea.cordova.purchase', {
  BILLING_KEY: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt1jKU0BtAlbyRUrKVWpPgCNNTAm25m9J/NqyBFK3bOUWQOLz7Eusn3euuQjXJmLDeG0IHMyF01/yd55VfFf+JoyUEwf+/D849wMGU+ZDP8G59tsOSKvYOzIAu1yG8aLI5jldkLnVTCZbiYEvQiv1eQZLhks5/T28/o8VTOaXpprtR5/cK3HIcLFu818Yz8WYjYt5MQqCy6GqfypNACmnT/+TbgYDf8szqV8ULKHtJMfipu2aUyPoN+JtfuoU4b+tPLbuoZWhOzKGQNnqaMslWh+hi8PMXZuZ1YReeGBgEaOWb6WOwwBprRfXKhtbLFbXaChZan2rnUC7Oj8cP2Dc2wIDAQAB"
});

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
});

App.accessRule("https://graph.facebook.com/*");
App.accessRule("https://pbs.twimg.com/*");
App.accessRule("*.bootstrapcdn.com/*");
