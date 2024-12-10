import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIService } from './openAi.service';
import { OpenAIClient } from 'src/openAi/openAiClient';
import { ConfigService } from '@nestjs/config';
import { ImageValidationResponse } from 'src/app.types';

// Mock OpenAIClient
jest.mock('src/openAi/openAiClient');

describe('OpenAIService', () => {
  let service: OpenAIService;
  let openAiClientMock: jest.Mocked<OpenAIClient>;

  beforeEach(async () => {
    openAiClientMock = {
      client: {
        beta: {
          chat: {
            completions: {
              parse: jest.fn(),
            },
          },
        },
      },
    } as any; // Mocking OpenAIClient

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAIService,
        {
          provide: OpenAIClient,
          useValue: openAiClientMock,  // Mock OpenAIClient
        },
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue('mock-api-key') },
        },
      ],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('askAboutImage', () => {
    it('should successfully process and return image validation response', async () => {
      // Arrange
      const mockResponse = {
        choices: [
          {
            message: {
              parsed: {
                match: true,
                message: 'Image matches the criteria',
              },
            },
          },
        ],
      };

      // Mock the parse method to resolve with mockResponse
      (openAiClientMock.client.beta.chat.completions.parse as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result: ImageValidationResponse = await service.askAboutImage(
        'Is this a valid image?',
        'image/png',
        'mockBase64ImageString'
      );

      // Assert
      expect(result).toEqual({
        match: true,
        message: 'Image matches the criteria',
      });
      expect((openAiClientMock.client.beta.chat.completions.parse as jest.Mock)).toHaveBeenCalledTimes(1);
      expect((openAiClientMock.client.beta.chat.completions.parse as jest.Mock)).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-4o-mini',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('You are an advanced AI specialized in image analysis'),
          }),
        ]),
      }));
    });

    it('should throw an error if OpenAI API fails', async () => {
      // Arrange
      (openAiClientMock.client.beta.chat.completions.parse as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      // Act & Assert
      await expect(
        service.askAboutImage('Is this a valid image?', 'image/png', 'mockBase64ImageString')
      ).rejects.toThrow('Failed to send image to GPT API');
    });

    it('should throw an error if API key is not set', async () => {
      // Arrange
      openAiClientMock.client = null; // Simulate missing OpenAI client

      // Act & Assert
      await expect(
        service.askAboutImage('Is this a valid image?', 'image/png', 'mockBase64ImageString')
      ).rejects.toThrow('Failed to send image to GPT API');
    });
  });
});
