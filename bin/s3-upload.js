'use strict';

require('dotenv').config();
const fs = require('fs');
const uploader = require('../lib/aws-s3-upload');

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

readFile(filename)
.then(uploader.prepFile)
.then(uploader.awsUpload)
.then(console.log)
.catch(console.error);
