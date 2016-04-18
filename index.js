// install babel hooks in the main process
require('babel-core/register');
import path from 'path';
import uuid from 'node-uuid';
import walk from 'walk';
import {v2 as cloudinary} from 'cloudinary';
import Utils from './utils';
import config from './config';

let files   = [];
let walker  = walk.walk(config.DIR_IMAGES_INPUT, { followLinks: false });
walker.on('file', (root, stat, next) => {
    files.push(`${root}/${stat.name}`);
    next();
});
walker.on('end', () => {
  files.map((file) => {
    let absolutPath = `${__dirname}${file.substring(1)}`;
    let extension   = path.extname(absolutPath);
    if(extension == '.jpg') {
      Utils.uploadAndTransform(absolutPath, {
        "transformation": [{
          "width": 100,
          "height": 100,
          "gravity": "face",
          "crop": "thumb"
        }]
      }).then((image) => {
        Utils.download(image.url, `${__dirname}/${config.DIR_IMAGES_OUTPUT}/${uuid.v1()}${extension}`);
      }).catch((err) => {
        console.warn(err);
      });
    }
  });
});
