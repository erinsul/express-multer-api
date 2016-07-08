'use strict';

require('dotenv').config();

const crypto = require('crypto');

const fs = require('fs');
const fileType = require('file-type');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const mimeType = (buffer) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(buffer));
};

const randomHexString = (length) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (error, buffer) => {
      if (error){
        reject(error);
      }
      resolve(buffer.toString('hex'));
    });
  });
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
  return randomHexString(16)
  .then((filename) => {
    let dir = new Date().toISOString().split('T')[0];
    return {
      ACL: "public-read",
      Body: file.data,
      Bucket: 'erin-wdi-files',
      ContentType: file.mime,
      Key: `${dir}/${filename}.${file.ext}`
    };
  })
  .then((options) => {
    return new Promise((resolve, reject) => {
      s3.upload(options, (err, data) => {
        if(err) {
          reject(err);
        }
        resolve(data);
      });
    });
  });
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
