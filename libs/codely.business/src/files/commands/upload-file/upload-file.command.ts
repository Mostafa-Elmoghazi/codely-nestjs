import { ApiProperty } from '@nestjs/swagger';
import { ICommand } from '@nestjs/cqrs';

export class UploadFileCommand implements ICommand {
  constructor(bucket: string, file: Express.Multer.File) {
    this.bucket = bucket;
    this.file = file;
  }
  @ApiProperty({ example: 'images', type: String })
  bucket: string;
  @ApiProperty({ example: 'images', type: String })
  file: Express.Multer.File;
}
