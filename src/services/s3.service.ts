import path from "node:path";
import { Readable } from "node:stream";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import { v4 } from "uuid";

import { configs } from "../configs/config";

class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_KEY,
      },
    });
  }

  public async uploadFile(
    file: UploadedFile,
    itemType: "user",
    itemId: string
  ): Promise<string> {
    const filepath = this.buildPath(itemType, itemId, file.name);
    await this.client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        Key: filepath,
        Body: file.data,
        ACL: configs.AWS_S3_ACL,
        ContentType: file.mimetype,
      })
    );
    return filepath;
  }

  public async deleteFile(filePath: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        Key: filePath,
      })
    );
  }

  public async uploadFileStream(
    stream: Readable,
    itemType: string,
    itemId: string,
    file: UploadedFile
  ): Promise<void> {
    const filepath = this.buildPath(itemType, itemId, file.name);
    await this.client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_NAME,
        Key: filepath,
        Body: stream,
        ACL: configs.AWS_S3_ACL,
        ContentType: file.mimetype,
        ContentLength: file.size,
      })
    );
  }
  private buildPath(type: string, id: string, fileName: string): string {
    return `${type}/${id}/${v4()}${path.extname(fileName)}`;
  }
}

export const s3Service = new S3Service();
