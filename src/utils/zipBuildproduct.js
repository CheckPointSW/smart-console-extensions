var fs = require('fs');
var JSZip = require('jszip');
const { file } = require('jszip');

var zip = new JSZip();

//go recursivly over
const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      zip.folder(dir + '/' + file);
      filelist = walkSync(dir + '/' + file, filelist);
    } else {
      filelist.push(dir + '/' + file);
      zip.file(dir + '/' + file, file);
    }
  });
  return filelist;
};

let allFiles = walkSync('build');

console.log('ziped files', JSON.stringify(allFiles));

zip
  .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
  .pipe(fs.createWriteStream('build.zip'))
  .on('finish', function() {
    // JSZip generates a readable stream with a "end" event,
    // but is piped here in a writable stream which emits a "finish" event.
    console.log('build.zip written.');
  });
