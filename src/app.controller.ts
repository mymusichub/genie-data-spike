import { Controller, Get, Query } from '@nestjs/common';
import { AnalysisService } from 'src/analysis/analysis.service';
import { PhylloService } from './phyllo/phyllo.service';
import { BigQueryService } from './bigquery/bigquery.service';
import { sumBy, meanBy, take } from 'lodash';

@Controller()
export class AppController {
  constructor(
    private readonly phylloService: PhylloService,
    private readonly bigQueryService: BigQueryService,
    private readonly analysisService: AnalysisService,
  ) {}

  @Get('/')
  async analyseUserId(@Query('userId') userId: string): Promise<UserAnalysis> {
    const bigQueryData = await this.bigQueryService.getByUserId(userId);
    const { id: phylloUserId } = await this.phylloService.getPhylloUser(userId);
    const profile = await this.phylloService.getProfiles(phylloUserId);
    const instagramAccount = profile[0];
    const instagramContentAllTime =
      await this.phylloService.getContentItemsByAccount(
        instagramAccount.account.id,
      );
    const instagramContentLast7Days =
      this.phylloService.selectContentByLastXDays(7, instagramContentAllTime);
    const instagramContentLast30Days =
      this.phylloService.selectContentByLastXDays(30, instagramContentAllTime);

    // Note: We may have to run https://api.staging.getphyllo.com/v1/social/contents/fetch-historic before this is done as the media url from instagram had expired
    const imageConsistencyAnalysis =
      await this.analysisService.analyzeImagesForVisualConsistency(
        take(
          instagramContentAllTime
            .filter((it) => it.format === 'IMAGE' && Boolean(it.media_url))
            .map((it) => it.media_url),
          5,
        ),
      );
    const postConsistencyAnalysis =
      await this.analysisService.analyzePostingTextForLanguageConsistency(
        take(instagramContentAllTime, 10)
          .filter((it) => Boolean(it.description))
          .map((it) => it.description),
      );
    const seoAnalysis = await this.analysisService.analyzeSeo(
      instagramAccount.full_name,
      instagramAccount.url,
    );
    const livePerformanceAnalysis =
      await this.analysisService.analyzeIfUserHasLivePerformances(
        instagramAccount.full_name,
      );
    const spotifyForArtistAnalysis =
      await this.analysisService.analyzeSpotifyForArtists(
        instagramAccount.full_name,
        instagramAccount.url,
      );
    const merchandiseAnalysis =
      await this.analysisService.analyzeIfUserHasMerchandiseForSale(
        instagramAccount.full_name,
      );

    return {
      isVerified: instagramAccount.is_verified,
      hasWebsite: Boolean(instagramAccount.website),
      gender: instagramAccount.gender,
      country: instagramAccount.country,
      location: instagramAccount.addresses?.[0]?.address,
      fullName: instagramAccount.full_name,
      firstName: instagramAccount.first_name,
      lastName: instagramAccount.last_name,
      nickName: instagramAccount.nick_name,

      numberOfFollowers: instagramAccount?.reputation.follower_count || 0,
      numberOfFollowing: instagramAccount?.reputation.following_count || 0,
      numberOfConnections: instagramAccount?.reputation.connection_count || 0,

      numberOfPostsLast7Days: instagramContentLast7Days.length,
      numberOfPostsLast30Days: instagramContentLast30Days.length,
      numberOfPostsAllTime: instagramContentLast7Days.length,

      numberOfCommentsLast7Days: sumBy(
        instagramContentLast7Days,
        (row) => row.engagement.comment_count,
      ),
      numberOfCommentsLast30Days: sumBy(
        instagramContentLast30Days,
        (row) => row.engagement.comment_count,
      ),
      numberOfCommentsAllTime: sumBy(
        instagramContentAllTime,
        (row) => row.engagement.comment_count,
      ),
      numberOfCommentsAverage: meanBy(
        instagramContentAllTime,
        (row) => row.engagement.comment_count,
      ),

      numberOfLikesLast7Days: sumBy(
        instagramContentLast7Days,
        (row) => row.engagement.like_count,
      ),
      numberOfLikesLast30Days: sumBy(
        instagramContentLast30Days,
        (row) => row.engagement.like_count,
      ),
      numberOfLikesAllTime: sumBy(
        instagramContentAllTime,
        (row) => row.engagement.like_count,
      ),
      numberOfLikesAverage: meanBy(
        instagramContentAllTime,
        (row) => row.engagement.like_count,
      ),

      numberOfTagsLast7Days: sumBy(
        instagramContentLast7Days,
        (row) => row.mentions?.length || 0,
      ),
      numberOfTagsLast30Days: sumBy(
        instagramContentLast30Days,
        (row) => row.mentions?.length || 0,
      ),
      numberOfTagsAllTime: sumBy(
        instagramContentAllTime,
        (row) => row.mentions?.length || 0,
      ),
      numberOfTagsAverage: meanBy(
        instagramContentAllTime,
        (row) => row.mentions?.length || 0,
      ),

      numberOfPostsImagesLast7Days: instagramContentLast7Days.filter(
        (it) => it.format === 'IMAGE',
      ).length,
      numberOfPostsImagesLast30Days: instagramContentLast30Days.filter(
        (it) => it.format === 'IMAGE',
      ).length,
      numberOfPostsImagesAllTime: instagramContentAllTime.filter(
        (it) => it.format === 'IMAGE',
      ).length,

      numberOfPostsVideosLast7Days: instagramContentLast7Days.filter(
        (it) => it.format === 'VIDEO',
      ).length,
      numberOfPostsVideosLast30Days: instagramContentLast30Days.filter(
        (it) => it.format === 'VIDEO',
      ).length,
      numberOfPostsVideosLastTime: instagramContentAllTime.filter(
        (it) => it.format === 'VIDEO',
      ).length,

      numberOfPostsReelsLast7Days: instagramContentLast7Days.filter(
        (it) => it.type === 'REELS',
      ).length,
      numberOfPostsReelsLast30Days: instagramContentLast30Days.filter(
        (it) => it.type === 'REELS',
      ).length,
      numberOfPostsReelsLastTime: instagramContentAllTime.filter(
        (it) => it.type === 'REELS',
      ).length,

      role: bigQueryData.user_role,
      numberOfLiveReleases: bigQueryData.ingested_releases,
      incomeLast12Months: bigQueryData.income_2024,

      aiConsistentPostingColorSchemeConfidence:
        imageConsistencyAnalysis.confidenceLevel,
      aiConsistentPostingColorSchemeReason: imageConsistencyAnalysis.message,

      aiConsistentPostingLanguageConfidence:
        postConsistencyAnalysis.confidenceLevel,
      aiConsistentPostingLanguageReason: postConsistencyAnalysis.message,

      aiLivePerformancesPublishedConfidence:
        livePerformanceAnalysis.confidenceLevel,
      aiLivePerformancesPublishedReason: livePerformanceAnalysis.message,

      aiSeoGoodConfidence: seoAnalysis.confidenceLevel,
      aiSeoGoodReason: seoAnalysis.message,

      aiMerchAvailableConfidence: merchandiseAnalysis.confidenceLevel,
      aiMerchAvailableReason: merchandiseAnalysis.message,

      aiSpotifyForArtistsClaimedConfidence:
        spotifyForArtistAnalysis.confidenceLevel,
      aiSpotifyForArtistsClaimedReason: spotifyForArtistAnalysis.message,
    };
  }
}

interface UserAnalysis {
  // General
  isVerified: boolean;
  hasWebsite: boolean;
  gender: string;
  country: string;
  location: string; // can this come from address
  fullName: string;
  firstName: string;
  lastName: string;
  nickName: string;

  // Posts
  numberOfFollowers: number;
  numberOfFollowing: number;
  numberOfConnections: number;

  // Posts
  numberOfPostsLast7Days: number;
  numberOfPostsLast30Days: number;
  numberOfPostsAllTime: number;

  // Comments
  numberOfCommentsLast7Days: number;
  numberOfCommentsLast30Days: number;
  numberOfCommentsAllTime: number; // Will have to limit content size in response
  numberOfCommentsAverage: number; // Will have to limit content size in response

  // Likes
  numberOfLikesLast7Days: number;
  numberOfLikesLast30Days: number;
  numberOfLikesAllTime: number; // Will have to limit content size in response
  numberOfLikesAverage: number; // Will have to limit content size in response

  // Tags
  numberOfTagsLast7Days: number;
  numberOfTagsLast30Days: number;
  numberOfTagsAllTime: number; // Will have to limit content size in response
  numberOfTagsAverage: number; // Will have to limit content size in response

  // Post quality
  numberOfPostsImagesLast7Days: number;
  numberOfPostsImagesLast30Days: number;
  numberOfPostsImagesAllTime: number;

  numberOfPostsVideosLast7Days: number;
  numberOfPostsVideosLast30Days: number;
  numberOfPostsVideosLastTime: number;

  numberOfPostsReelsLast7Days: number;
  numberOfPostsReelsLast30Days: number;
  numberOfPostsReelsLastTime: number;

  // AI Questions
  aiConsistentPostingColorSchemeConfidence: number;
  aiConsistentPostingColorSchemeReason: string;
  aiConsistentPostingLanguageConfidence: number;
  aiConsistentPostingLanguageReason: string;
  aiSpotifyForArtistsClaimedConfidence: number;
  aiSpotifyForArtistsClaimedReason: string;
  aiLivePerformancesPublishedConfidence: number;
  aiLivePerformancesPublishedReason: string;
  aiMerchAvailableConfidence: number;
  aiMerchAvailableReason: string;
  aiSeoGoodConfidence: number;
  aiSeoGoodReason: string;

  // MusicHub
  role?: string;
  genre?: string;
  mainArtist?: string;
  daysUntilNextRelease?: number;
  incomeLast12Months?: number;

  numberOfLiveReleases?: number;
  numberOfBioPages?: number;
  numberOfSoundfileUplpads?: number;
  numberOfFeaturedArtists?: number;

  // Streams
  numberOfStreamsLast7Days?: number;
  numberOfStreamsLast30Days?: number;
  numberOfStreamsLast365Days?: number;
}
