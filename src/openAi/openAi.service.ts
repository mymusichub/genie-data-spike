import { Injectable } from '@nestjs/common';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ImageValidationResponse } from 'src/app.types';
import { OpenAIClient } from 'src/openAi/openAiClient';
import { z } from 'zod';

const OpenAIImageValidationResponse = z.object({
  match: z.boolean(),
  message: z.string(),
});

@Injectable()
export class OpenAIService {
  constructor(private openAiClient: OpenAIClient) {}

  async askAboutImage(
    prompt: string,
    mimeType: string,
    imageBase64: string,
  ): Promise<ImageValidationResponse> {
    try {
      const response =
        await this.openAiClient.client.beta.chat.completions.parse({
          model: 'gpt-4o-mini',
          response_format: zodResponseFormat(
            OpenAIImageValidationResponse,
            'validation',
          ),
          messages: [
            {
              role: 'system',
              content: `
              You are an advanced AI specialized in image analysis. Your task is to analyze images and determine, to the best of your ability, whether they satisfy specific criteria provided in a command. These criteria could pertain to items, text, colors, file types, or any other significant details about the image.
              
              When I send you an image in Base64 format, your response must be a JSON object structured as follows:
              
              {
                  "match": boolean, // Indicates if the image satisfies the command (true if it matches, false otherwise).
                  "message": string // A concise explanation of why the command succeeded or failed based on the provided criteria.
              }
              
              Always ensure your response is accurate and concise, explaining your reasoning clearly in the \`message\` field.
            `.trim(),
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
        });

      return response.choices[0].message.parsed;
    } catch (error) {
      console.error(
        'Error sending image to GPT:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to send image to GPT API');
    }
  }
}
