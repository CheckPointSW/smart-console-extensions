#!/usr/bin/env node

const fs= require('fs');
var filePath = './build/service-worker.js'; 
fs.unlinkSync(filePath);

const zipFolder = require('zip-a-folder');

class ZipAFolder {
  static main() {
    zipFolder.zipFolder('build', 'build.zip', function(err) {
      if (err) {
        console.debug('Something went wrong!', err);
      }
    });
  }
}

ZipAFolder.main();
