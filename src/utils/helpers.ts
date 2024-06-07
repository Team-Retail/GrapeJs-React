// awsConfig.js
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const REGION = import.meta.env.VITE_APP_AWS_REGION; // e.g., "us-west-2"
const BUCKET_NAME = import.meta.env.VITE_APP_AWS_BUCKET_NAME;


const listObjects = async (prefix) => {
  const s3Client = new S3Client({
    region: import.meta.env.VITE_APP_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY,
    },
  });
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });
  const response = await s3Client.send(command);
  return response.Contents;
};

export { listObjects };
