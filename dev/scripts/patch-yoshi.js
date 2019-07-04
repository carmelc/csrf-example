var fs = require('fs');
const yoshiFileToPatch = './node_modules/yoshi/src/webpack-utils.js';
console.log('Patching Yoshi');

fs.readFile(yoshiFileToPatch, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  const attributeToPatch = 'disableHostCheck: true,\n    ';
  const result = data.replace(attributeToPatch, '').replace('allowedHosts:', attributeToPatch + 'allowedHosts:');

  fs.writeFile(yoshiFileToPatch, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Patching Yoshi - Done');