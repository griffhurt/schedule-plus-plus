#!/bin/sh

# Create the build folder
mkdir -p build

# Make the Firefox and Chrome build folders
mkdir -p build/firefox
mkdir -p build/chrome

# Copy the right version of manifest
cp manifest.v2.json build/firefox/manifest.json
cp manifest.v3.json build/chrome/manifest.json

# Copy the files to firefox
cp inject.js build/firefox/inject.js
cp -R spp_data/ build/firefox/spp_data
cp -R icon/ build/firefox/icon
cp -R scripts/ build/firefox/scripts

# Copy the files to chrome
cp inject.js build/chrome/inject.js
cp -R spp_data/ build/chrome/spp_data
cp -R icon/ build/chrome/icon
cp -R scripts/ build/chrome/scripts