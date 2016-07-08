'use strict';

const fs = require('fs');
const fileType = require('file-type');

const mimeType = (buffer) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(buffer));
};

let filename = process.argv[2] || '';

const readFile = (filename) => {
  return new Promise ((res, rej) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        rej(err);
      }
      res(data);
    });
  });
};

const awsUpload = (file) => {
  const options = {
    ACL: "public-read",
    Body: file.data,
    Bucket: 'erin-wdi-files',
    ContentType: file.mime,
    Key: `test/test.${file.ext}`
  };
  return Promise.resolve(options);
};

readFile(filename)
.then((data) => {
  let file = mimeType(data);
  file.data = data;
  return file;
})
.then(awsUpload)
.then(console.log)
.catch(console.error);
