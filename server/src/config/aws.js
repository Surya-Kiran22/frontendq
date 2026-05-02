const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = (file, folder, fileName) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${folder}/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  return s3.upload(params).promise();
};

const deleteFromS3 = (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };

  return s3.deleteObject(params).promise();
};

const getSignedUrl = (key, expiresIn = 3600) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: expiresIn,
  };

  return s3.getSignedUrlPromise('getObject', params);
};

module.exports = {
  s3,
  uploadToS3,
  deleteFromS3,
  getSignedUrl,
};
