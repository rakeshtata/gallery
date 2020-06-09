import { RNS3 } from 'react-native-s3-upload';
const options = {
  keyPrefix: "uploads/",
  bucket: "image-picker-test",
  region: "us-west-1",
  accessKey: "",
  secretKey: "",
  successActionStatus: 201
}

const s3file = (store) => {
    return {
     uri: JSON.parse(store[1]).uri,
     name: `image${store[0]}.png`,
     type: "image/png"
   }
 }

const PutImageToS3 = (store) => {
  RNS3.put(s3file(store), options).then(response => {
   if (response.status !== 201)
     throw new Error("Failed to upload image to S3");
   console.log(response.body);
  });
}

export default PutImageToS3;
