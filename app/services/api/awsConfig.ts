import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

// AWS S3 Credentials
const s3Client = new S3Client({
  region: "us-west-2",
  credentials: {
    accessKeyId: "AKIAZ3MGNM7CYJACYCGQ",
    secretAccessKey: "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",
  },
});

// Function to Generate Signed URL
export const getPresignedUrl = async (fileName) => {
  try {
    const command = new GetObjectCommand({
      Bucket: "whereismyelf-dev",
      Key: `mobileapp/${fileName}`,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    console.log("Signed URL:", url);
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};
