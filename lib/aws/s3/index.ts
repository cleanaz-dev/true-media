//app/lib/aws/s3/index.ts

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION ?? "us-east-1";
const bucket = process.env.AWS_S3_BUCKET_NAME!;

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Presigned GET url (for private files)
export async function getPresignedUrl(key: string, expiresInSeconds = 900) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

export async function deleteFile(key: string) {
  return s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

// Public upload -> returns a direct public URL
export async function uploadFilePublic(
  key: string,
  body: PutObjectCommand["input"]["Body"],
  contentType?: string
) {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

// Private upload -> access later via getPresignedUrl(key)
export async function uploadFilePrivate(
  key: string,
  body: PutObjectCommand["input"]["Body"],
  contentType?: string
) {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return key;
}

export async function getFileBuffer(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(command);

  if (!response.Body) {
    throw new Error(`Failed to read file from S3: ${key}`);
  }

  // Convert the S3 stream to a Buffer
  const byteArray = await response.Body.transformToByteArray();
  return Buffer.from(byteArray);
}

export async function getPdfSignedUrl(key: string, expiresInSeconds = 900) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentType: "application/pdf",
    ResponseContentDisposition: "inline",
  });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}
 