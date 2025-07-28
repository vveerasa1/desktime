const AWS = require("aws-sdk");
const config = require("../config");
// const s3 = new AWS.S3({
//   accessKeyId: config.AWS.ACCESS_KEY_ID,
//   secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
//   region: 'Beauharnois',
//   ACL: "public-read",
// });
const s3 = new AWS.S3({
  accessKeyId: config.AWS.ACCESS_KEY_ID,
  secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
  endpoint: new AWS.Endpoint(config.AWS.endpoint), // example OVH S3 endpoint
  region: "bhs",
  s3ForcePathStyle: true, // important for OVH
});

const uploadFile = async (parameters) => {
  const data = await new Promise((resolve, reject) => {
    s3.upload(parameters, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        reject("Error uploading file");
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
        resolve(data);
      }
    });
  });
  return data;
};

/**
 * File upload to S3 bucket
 *
 * @param {*} file
 * @param {*} bucketName
 * @returns
 */
const uploadFileToS3 = async (file, folderPath) => {
  console.log(file, "FILEEEE");
  if (!file) return;
  const fileExtension = file.originalname.split(".").pop();
  const fileNameWithoutExtension = file.originalname
    .split(".")
    .slice(0, -1)
    .join(".");
  const newFileName = `${fileNameWithoutExtension}.${fileExtension}`;

  const params = {
    Bucket: "trackme",
    Key: `${folderPath}/${newFileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  return await uploadFile(params);
};

module.exports = {
  uploadFile,
  uploadFileToS3,
};
