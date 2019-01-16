const cloudinary = require('cloudinary');
const uuid = require('uuid/v4');

const Image = require('./../models/image');
const {
  ENV, CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
} = require('./../common/env');
const { logger } = require('./../utils/logger');

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});


const uploadImageCloudinary = async file => new Promise((resolve, reject) => {
  logger.debug(JSON.stringify(file));
  const publicId = `${ENV}/${uuid()}`;
  cloudinary.v2.uploader.upload(file.path, { public_id: publicId },
    (err, result) => {
      if (err) { return reject(err.message); }
      const image = new Image({
        provider: 'cloudinary',
        path: result.secure_url
      });
      image.save((mongoErr) => {
        if (mongoErr) {
          return reject(err);
        }
        return resolve(image);
      });
    });
  // cloudinary.v2.uploader.upload(`${ENV}/${file}`);
});

const deleteImageCloudinary = async image => new Promise((resolve, reject) => {
  const publicId = image.path.split('/').slice(-2).join('/');
  cloudinary.v2.uploader.destroy(publicId,
    { invalidate: true }, (error) => {
      if (error) {
        return reject(error);
      }
      Image.deleteOne({ _id: image.id }, (dberr, dbResult) => {
        if (!dbResult.ok || dberr) {
          return reject(new Error('Cannot save the image'));
        }
        return resolve(true);
      });
    });
});

/**
 * Return Image model if upload success
 * otherize throw Error.
 * @param {*} file
 */
const uploadImage = async file => uploadImageCloudinary(file);

const deleteImage = async image => deleteImageCloudinary(image);

module.exports = {
  uploadImage,
  deleteImage,
};
