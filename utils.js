import http from 'http';
import fs   from 'fs';
import {v2 as cloudinary} from 'cloudinary';
import config from './config';

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET,
});

export default class Utils {
  static uploadAndTransform(imagePath, options) {
    return new Promise(function(resolve, reject) {
      cloudinary.uploader.upload(imagePath, options, function(err, image){
        if(err) {
          reject(err);
        }
        resolve(image);
      });
    });
  }
  static download(url, fileDest) {
    let file = fs.createWriteStream(fileDest);
    let request = http.get(url, function(response) {
      response.pipe(file);
    });
  }
};
