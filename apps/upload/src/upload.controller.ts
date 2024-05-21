import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ERROR_MESSAGE } from '@app/common';
import { S3Service } from '@app/s3';

const FilePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }),
    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
  ],
})

@Controller('upload')
export class UploadController {
  constructor(
    private readonly s3Service: S3Service
  ) {}

  @Post('/product-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductImage(
    @UploadedFile(FilePipe)
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException(ERROR_MESSAGE.BAD_REQUEST)
    }

    const { originalname, mimetype, buffer } = file
    return await this.s3Service.upload(
      originalname,
      mimetype,
      buffer
    )
  }

  @Post('/user-picture')
  @UseInterceptors(FileInterceptor('picture'))
  async uploadUserPicture(
    @UploadedFile(FilePipe)
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException(ERROR_MESSAGE.BAD_REQUEST)
    }

    const { originalname, mimetype, buffer } = file
    return await this.s3Service.upload(
      originalname,
      mimetype,
      buffer
    )
  }
}
