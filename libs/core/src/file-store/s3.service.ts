import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(S3Service.name);

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(
    bucketName: string,
    key: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      });
      await this.s3Client.send(command);
      this.logger.log(`File uploaded successfully to ${bucketName}/${key}`);
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw error;
    }
  }

  async downloadFile(bucketName: string, key: string): Promise<Buffer> {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const { Body } = await this.s3Client.send(command);

    // Convert the stream to buffer and return
    const streamToBuffer = (stream: any): Promise<Buffer> =>
      new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });

    return await streamToBuffer(Body);
  }

  async createBucket(bucketName: string): Promise<void> {
    try {
      const command = new CreateBucketCommand({ Bucket: bucketName });
      await this.s3Client.send(command);
      this.logger.log(`Bucket created successfully: ${bucketName}`);
    } catch (error) {
      this.logger.error(`Failed to create bucket: ${error.message}`);
      throw error;
    }
  }

  async deleteBucket(bucketName: string): Promise<void> {
    try {
      const command = new DeleteBucketCommand({ Bucket: bucketName });
      await this.s3Client.send(command);
      this.logger.log(`Bucket deleted successfully: ${bucketName}`);
    } catch (error) {
      this.logger.error(`Failed to delete bucket: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(bucketName: string, key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully from ${bucketName}/${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }

  async getSignedUrl(
    bucketName: string,
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw error;
    }
  }
}
