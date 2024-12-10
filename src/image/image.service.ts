import { BadRequestException, Injectable } from '@nestjs/common';
import { OpenAIService } from 'src/openAi/openAi.service';
import { ImageValidationResponse } from 'src/app.types';

@Injectable()
export class ImageService {
  private readonly ALLOWED_FILE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
  ];

  constructor(private readonly openAiService: OpenAIService) {}

  private encodeImageToBase64(file: Express.Multer.File): string {
    if (!file || !this.ALLOWED_FILE_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
      );
    }
    return file.buffer.toString('base64');
  }

  async processAndAnalyzeImage(
    file: Express.Multer.File,
    prompt: string,
  ): Promise<ImageValidationResponse> {
    const imageBase64 = this.encodeImageToBase64(file);

    return this.openAiService.askAboutImage(prompt, file.mimetype, imageBase64);
  }
}
