import { 
  Controller, 
  Get, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  Body, 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ImageValidationResponse } from 'src/app.types';

@Controller("/images")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/validate')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('prompt') prompt: string,
  ): Promise<ImageValidationResponse> {
    return this.imageService.processAndAnalyzeImage(file, prompt);
  }
}
