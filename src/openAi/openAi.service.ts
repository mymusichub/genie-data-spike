import { Injectable } from '@nestjs/common';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatCompletionContentPart } from 'openai/resources/chat';
import { OpenAIClient } from 'src/openAi/openAi.client';
import { z } from 'zod';

const OpenAIAnalysisResponse = z.object({
  statement: z.string(),
  confidenceLevel: z.number(),
  message: z.string(),
});

export type AnalysisResponse = typeof OpenAIAnalysisResponse._type;

@Injectable()
export class OpenAIService {
  constructor(private openAiClient: OpenAIClient) {}

  async analyzeImages(
    prompt: string,
    imageUrls: string[],
  ): Promise<AnalysisResponse> {
    try {
      const response =
        await this.openAiClient.client.beta.chat.completions.parse({
          model: 'gpt-4o-mini',
          response_format: zodResponseFormat(
            OpenAIAnalysisResponse,
            'validation',
          ),
          messages: [
            {
              role: 'system',
              content: `
              You are an advanced AI specialized in image analysis. Your task is to analyze one or more images and evaluate whether they satisfy specific criteria provided in a command. When more than 1 image is provided you must also perform comparative assessments to determine whether all, some, or none of the images meet the criteria. For each determination, you will provide a confidence estimate between 0 and 100, where 0 indicates no confidence and 100 indicates absolute confidence that the statement is correct. When applicable, describe the visual evidence or reasoning behind your confidence level.
              These criteria could pertain to text, colors, file types, or any other significant details about the image.
              
              When I send you a set of image urls, your response must be a JSON object structured as follows:
              
              {
                  "statement": string,  // A summary of the statement you are analyzing
                  "confidenceLevel": number, // Indicates if the image satisfies the command (100 if it matches, 0 otherwise).
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
                ...(imageUrls.map((it) => {
                  return {
                    type: 'image_url',
                    image_url: {
                      url: it,
                      detail: 'low',
                    },
                  };
                }) as ChatCompletionContentPart[]),
              ],
            },
          ],
        });

      console.log('Tokens used to analyzeImages', response.usage.total_tokens);
      return response.choices[0].message.parsed;
    } catch (error) {
      console.error(
        'Error sending image to GPT:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to send image to GPT API');
    }
  }

  async analyzeLanguage(
    prompt: string,
    textBlocks: string[],
  ): Promise<AnalysisResponse> {
    try {
      const response =
        await this.openAiClient.client.beta.chat.completions.parse({
          model: 'gpt-4o-mini',
          response_format: zodResponseFormat(
            OpenAIAnalysisResponse,
            'validation',
          ),
          messages: [
            {
              role: 'system',
              content: `
              You are an advanced AI specialized in linguistic analysis. Your task is to analyze one or more text blocks and evaluate whether they satisfy specific criteria provided in a command. When more than 1 text block is provided you must also perform comparative assessments to determine whether all, some, or none of the images meet the criteria. For each determination, you will provide a confidence estimate between 0 and 100, where 0 indicates no confidence and 100 indicates absolute confidence that the statement is correct. When applicable, describe the evidence or reasoning behind your confidence level.
              These criteria could pertain to text, colors, file types, or any other significant details about the image.
              
              When I send you a set of text blocks from posts, your response must be a JSON object structured as follows:
              
              {
                  "statement": string,  // A summary of the statement you are analyzing
                  "confidenceLevel": number, // Indicates if the text block satisfies the command (100 if it matches, 0 otherwise)..
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
                ...(textBlocks.map((text) => {
                  return {
                    type: 'text',
                    text,
                  };
                }) as ChatCompletionContentPart[]),
              ],
            },
          ],
        });

      console.log(
        'Tokens used to analyzeLanguage',
        response.usage.total_tokens,
      );
      return response.choices[0].message.parsed;
    } catch (error) {
      console.error(
        'Error sending image to GPT:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to send image to GPT API');
    }
  }

  async webSearch(webSearchPrompt: string): Promise<AnalysisResponse> {
    try {
      const response = await this.openAiClient.client.responses.create({
        model: 'gpt-4o',
        tools: [
          {
            type: 'web_search_preview',
            user_location: {
              type: 'approximate',
              country: 'DE',
            },
          },
        ],
        input: `
          ${webSearchPrompt}

          Please return your response to the web search in the following format.

          {
            "statement": string,  // A summary of the websearch prompt you are analyzing
            "confidenceLevel": number, // Indicates if any part of the web search resulted in high confidence in being true (100 if it matches, 0 otherwise).
            "message": string // A concise explanation of why the command succeeded or failed based on the provided criteria. Along with the citations comma separated.
          }
          
          Always ensure your response is accurate and concise and adhering to the json output, explaining your reasoning clearly in the \`message\` field. Never return the "json" snippet identifier in response.
        `,
      });

      console.log(
        'Tokens used to perform webSearch',
        response.usage.total_tokens,
      );
      return OpenAIAnalysisResponse.parse(JSON.parse(response.output_text));
    } catch (error) {
      console.error(
        'Error sending image to GPT:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to send image to GPT API');
    }
  }
}
