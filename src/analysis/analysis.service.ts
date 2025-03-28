import { Injectable } from '@nestjs/common';
import { AnalysisResponse, OpenAIService } from 'src/openAi/openAi.service';

@Injectable()
export class AnalysisService {
  constructor(private readonly openAiService: OpenAIService) {}

  async analyzeImagesForVisualConsistency(
    images: string[],
  ): Promise<AnalysisResponse> {
    try {
      const prompt = `
        The images provided share a consistent visual style, defined by a similar color scheme (including saturation and contrast), shape and composition (such as framing and geometric characteristics), and format type (photo, illustration, or graphic).
      `
      console.time("Analyze images");
      const response = await this.openAiService.analyzeImages(prompt, images);
      console.timeEnd("Analyze images");
      return response;
    } catch (e) {
      return {
        confidenceLevel: 30 // unknown, don't want to say out right no confidence due to failure - TBD
      }
    }
  }

  async analyzePostingTextForLanguageConsistency(
    posts: string[],
  ): Promise<AnalysisResponse> {
    try {
      const prompt = `
        The language used in the social posts is consistent, characterized by a similar tone (e.g., formal, casual, humorous), vocabulary style (e.g., technical, conversational, slang), and sentence structure (e.g., short and punchy or long and descriptive).
      `;

      console.time("Analyze posts");
      const response = await this.openAiService.analyzeLanguage(prompt, posts);
      console.timeEnd("Analyze posts");
      return response;
    } catch (e) {
      return {
        confidenceLevel: 30 // unknown, don't want to say out right no confidence due to failure - TBD
      }
    }
  }

  async analyzeIfUserHasLivePerformances(
    artistName: string,
  ): Promise<AnalysisResponse> {
    try {
      const prompt = `
      Find upcoming live performances or past events for the artist ${artistName}. Check sources such as their official website, Spotify page, Resident Advisor profile, or other reliable event listing platforms.
      `;

      console.time("Analyze live performances");
      const response = await this.openAiService.webSearch(prompt);
      console.timeEnd("Analyze live performances");
      return response;
    } catch (e) {
      return {
        confidenceLevel: 30 // unknown, don't want to say out right no confidence due to failure - TBD
      }
    }
  }

  async analyzeIfUserHasMerchandiseForSale(
    artistName: string,
  ): Promise<AnalysisResponse> {
    try {
      const prompt = `
        Find merchandise that might be for sale for ${artistName}. Check sources such as their official website, Spotify page, Bandcamp, or other reliable merchandise platforms for musicians.
      `;

      console.time("Analyze merch");
      const response = await this.openAiService.webSearch(prompt);
      console.timeEnd("Analyze merch");
      return response;
    } catch (e) {
      return {
        confidenceLevel: 30 // unknown, don't want to say out right no confidence due to failure - TBD
      }
    }
  }

  async analyzeSeo(
    artistName: string,
    instagramUrl: string
  ): Promise<AnalysisResponse> {
    try {
      const prompt = `
        It is possible to locate the instagram page ${instagramUrl} via google by searching for ${artistName}.
      `;

      console.time("Analyze SEO");
      const response = await this.openAiService.webSearch(prompt);
      console.timeEnd("Analyze SEO");
      return response;
    } catch (e) {
      return {
        confidenceLevel: 30 // unknown, don't want to say out right no confidence due to failure - TBD
      }
    }
  }

  async analyzeSpotifyForArtists(
    artistName: string,
    instagramUrl: string
  ): Promise<AnalysisResponse> {
    try {
      const prompt = `
        The Musician ${artistName} with an instagram url of ${instagramUrl} is on Spotify (profiles available publicly to search via https://open.spotify.com/search/XX/artists) and there are linked social platforms.
      `;

      console.time("Analyze spotify for artists");
      const response = await this.openAiService.webSearch(prompt);
      console.timeEnd("Analyze spotify for artists");
      return response;
    } catch (e) {
      return {
        confidenceLevel: 30 // unknown, don't want to say out right no confidence due to failure - TBD
      }
    }
  }
}
