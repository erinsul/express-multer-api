'use strict';

const fs = require('fs');

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
.then((data) => {
  console.log(`${filename} is ${data.length} bytes long`);
})
.catch(console.error);
