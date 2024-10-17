import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileSystemService {
  private readonly rootUploadPath = './uploads'; // root folder for uploads

  async uploadFile(
    file: Express.Multer.File,
    bucket: string,
  ): Promise<{ fileId: string; fileUrl: string }> {
    if (!file) {
      throw new BadRequestException('File not provided');
    }

    // Ensure the bucket folder exists
    const bucketFolderPath = path.join(this.rootUploadPath, bucket);
    if (!fs.existsSync(bucketFolderPath)) {
      fs.mkdirSync(bucketFolderPath, { recursive: true });
    }

    // Generate a unique file ID
    const fileId = uuidv4();

    // Extract the file extension
    const fileExtension = path.extname(file.originalname);

    // Construct the file name and path
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(bucketFolderPath, fileName);

    // Save the file to the file system
    fs.writeFileSync(filePath, file.buffer);

    // Construct the file URL
    const fileUrl = `/uploads/${bucket}/${fileName}`;

    return {
      fileId,
      fileUrl,
    };
  }
}
