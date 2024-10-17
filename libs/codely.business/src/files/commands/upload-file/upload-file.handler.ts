import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadFileCommand } from './upload-file.command';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Configuration } from 'codely/codely.business/common';
import { FileSystemService } from '@app/core/file-store';
import { FileResponseDto } from 'codely/codely.entities/dtos';

@Injectable()
@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler
  implements ICommandHandler<UploadFileCommand>
{
  constructor(
    private fileService: FileSystemService,
    private configService: Configuration,
  ) {}

  async execute(command: UploadFileCommand): Promise<FileResponseDto> {
    try {
      return await this.fileService.uploadFile(command.file, command.bucket);
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: error,
      });
    }
  }
}
