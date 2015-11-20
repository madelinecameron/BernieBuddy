#!/bin/bash

echo "Building Android app from Meteor..."
meteor build ~/AndroidBuild --server https://berniebuddydev.herokuapp.com
cd ~/AndroidBuild/android
echo "Signing APK..."
sudo jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/.ssh/androidkey.keystore ./release-unsigned.apk berniebuddy
echo "Zipaligning..."
zipalign -v 4 release-unsigned.apk berniebuddy.apk
adb uninstall com.berniebuddy
echo "Installing..."
adb install berniebuddy.apk
