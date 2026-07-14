const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('archiver');

const dist = path.join(__dirname, '..', 'dist');
const output = path.join(__dirname, '..', 'cv-smart-assistant.zip');

const outputStream = fs.createWriteStream(output);
const archive = new ZipArchive();

archive.pipe(outputStream);
archive.directory(dist, false);

outputStream.on('close', () => {
  const size = (archive.pointer() / 1024).toFixed(1);
  console.log(`Created ${output} (${size} KB)`);
});

archive.on('error', (err) => { throw err; });

archive.finalize();
