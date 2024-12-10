import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ImageService } from 'src/image/image.service';
import { OpenAIService } from 'src/openAi/openAi.service';

describe('ImageService', () => {
  let imageService: ImageService;
  let openAiService: OpenAIService;

  // Mock OpenAIService
  const mockOpenAiService = {
    askAboutImage: jest.fn(),
  };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        { provide: OpenAIService, useValue: mockOpenAiService },
      ],
    }).compile();

    imageService = app.get<ImageService>(ImageService);
    openAiService = app.get<OpenAIService>(OpenAIService);
  });

  describe('encodeImageToBase64', () => {
    it('should throw BadRequestException if the file type is not allowed', () => {
      const file = {
        mimetype: 'image/bmp',
        buffer: Buffer.from('image data'),
      } as Express.Multer.File;

      expect(() => imageService['encodeImageToBase64'](file)).toThrow(
        new BadRequestException(
          'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
        ),
      );
    });

    it('should return base64 string when file type is valid', () => {
      // Arrange
      const file = {
        mimetype: 'image/jpeg',
        buffer: Buffer.from('image data'),
      } as Express.Multer.File;

      const result = imageService['encodeImageToBase64'](file);

      expect(result).toBe('aW1hZ2UgZGF0YQ=='); // Base64 encoded 'image data'
    });
  });

  describe('processAndAnalyzeImage', () => {
    it('should call OpenAIService.askAboutImage with correct parameters', async () => {
      // Arrange
      const file = {
        mimetype: 'image/png',
        buffer: Buffer.from('image data'),
      } as Express.Multer.File;
      const prompt = 'Analyze the image content';
      const base64Image = file.buffer.toString('base64');
      const expectedResponse = { success: true, analysis: 'some result' }; // Example response

      mockOpenAiService.askAboutImage.mockResolvedValue(expectedResponse);

      // Act
      const result = await imageService.processAndAnalyzeImage(file, prompt);

      // Assert
      expect(openAiService.askAboutImage).toHaveBeenCalledWith(
        prompt,
        file.mimetype,
        base64Image,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if file type is not allowed', async () => {
      // Arrange
      const file = {
        mimetype: 'image/bmp',
        buffer: Buffer.from('image data'),
      } as Express.Multer.File;
      const prompt = 'Analyze the image content';

      // Act & Assert
      await expect(
        imageService.processAndAnalyzeImage(file, prompt),
      ).rejects.toThrow(
        new BadRequestException(
          'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
        ),
      );
    });
  });
});
