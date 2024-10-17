import {
  Controller,
  Post,
  UploadedFile,
  Param,
  Response,
  UseInterceptors,
  UseGuards,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Mediator } from 'codely/codely.business/common';
import { BaseController } from '../base.controller';
import { UploadFileCommand } from 'codely/codely.business/files/commands';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import { FileResponseDto } from 'codely/codely.entities/dtos';

@ApiTags('files')
@Controller('files')
export class FilesController extends BaseController {
  constructor(private mediator: Mediator) {
    super();
  }

  @ApiCreatedResponse({
    type: FileResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload/:bucket')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('bucket') bucket: string,
  ): Promise<FileResponseDto> {
    return await this.mediator.command(new UploadFileCommand(bucket, file));
  }

  @Get('/*')
  @ApiExcludeEndpoint()
  download(@Param() params, @Response() response) {
    console.log(params);
    return response.sendFile(params[0], { root: './uploads' });
  }
}
