"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
// Configure S3 Client
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
/**
 * Uploads a file to AWS S3.
 * @param fileKey - The key (path) to store the file in the S3 bucket (e.g., "uploads/example.jpg").
 * @param fileBuffer - The file content as a Buffer.
 * @param fileType - The MIME type of the file (e.g., "image/jpeg").
 * @returns The public URL of the uploaded file.
 */
const uploadToS3 = async (fileKey, fileBuffer, fileType) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: fileType,
    };
    try {
        const command = new client_s3_1.PutObjectCommand(params);
        const response = await s3.send(command);
        console.log("File uploaded successfully:", fileKey);
        return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }
    catch (error) {
        console.error("Error uploading file to S3:", error);
        throw new Error("Failed to upload file to S3.");
    }
};
exports.uploadToS3 = uploadToS3;
