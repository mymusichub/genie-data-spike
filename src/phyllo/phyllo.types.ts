export interface PhylloUser {
  id: string;
}

export interface PhylloContentItem {
  title: string; // Title of the content item
  format: "VIDEO" | "IMAGE" | "AUDIO" | "TEXT" | "OTHER"; // Media type of the content item
  type: "VIDEO" | "POST" | "STORY" | "TWEET" | "BLOG" | "IMAGE" | "THREAD" | "PODCAST" | "TRACK" | "REELS" | "STREAM" | "FEED" | "IGTV"; // Platform specific content type
  url: string; // Platform permanent content URL
  media_url: string; // Direct media URL of the content item
  duration: number; // Video duration in seconds (only available for YouTube)
  description: string; // Description of the content item
  thumbnail_url: string; // Thumbnail URL of the content item
  published_at: string; // Publishing timestamp of the content item
  platform_profile_id: string; // Unique profile ID of the user on the work platform
  platform_profile_name: string; // User's profile name on the work platform
  engagement: PhylloEngagement; // Engagement-related data
  external_id: string; // Unique content ID on the platform
  sponsored: PhylloSponsored; // Sponsored content information
  collaboration: PhylloCollaboration; // Collaboration-related information
  is_owned_by_platform_user: boolean; // Whether the content is owned by the platform user
  hashtags: string[]; // Array of hashtags used in the media description
  mentions: string[]; // Array of mentioned accounts in the media
}

export interface PhylloEngagement {
  like_count: number; // Total likes
  dislike_count: number; // Total dislikes
  comment_count: number; // Total comments
  impression_organic_count: number; // Total organic impressions
  reach_organic_count: number; // Total organic reach
  save_count: number; // Total item saves
  view_count: number; // Total views
  watch_time_in_hours: number; // Total watch time in hours (only for video format)
  share_count: number; // Total shares
  impressions_paid_count: number; // Total paid impressions
  reach_paid_count: number; // Total paid reach
  avg_watch_time_in_sec: number; // Average watch time of reel in seconds
}

export interface PhylloSponsored {
  is_sponsored: boolean; // Indicates if the content item is sponsored
  tags: string[]; // Sponsor tag (can include mentions of the sponsor)
}

export interface PhylloCollaboration {
  has_collaborators: boolean; // Indicates if the content item has collaborators
}

export interface PhylloUserProfile {
  id: string;
  platform_username: string; // Username of the connected account
  full_name: string; // Full name of the user profile
  first_name: string; // First name of the user profile
  last_name: string; // Last name of the user profile
  nick_name: string; // Nickname of the user profile
  url: string; // Profile URL on the connected platform
  introduction: string; // Description of the profile
  image_url: string; // URL of the profile image on the platform
  date_of_birth: string; // Date of birth of the user on the platform
  external_id: string; // Unique identifier of the profile on the platform
  platform_account_type: string; // Account type of the user on the platform
  category: string; // Category of the user's platform account
  website: string; // User website listed on the platform
  reputation: PhylloReputation; // Reputation-related data
  emails: PhylloEmail[]; // Email IDs of the user
  phone_numbers: PhylloPhoneNumber[]; // Phone numbers of the user
  addresses: PhylloAddress[]; // Address of the user
  gender: string; // Gender of the user
  country: string; // Country of the user on the connected platform
  platform_profile_name: string; // User's profile name on the work platform
  platform_profile_id: string; // Unique profile ID of the user on the work platform
  platform_profile_published_at: string; // Timestamp when the profile was created on the platform
  is_verified: boolean; // Whether the profile is verified
  is_business: boolean; // Whether the profile is a business account
  account: {
    id: string;
    platform_username: string;
    username: string;
  },
  work_platform: {
    id: string
    name: string;
    logo_url: string;
  }
}

export interface PhylloReputation {
  follower_count: number; // Total number of followers
  connection_count: number; // Total number of connections
  following_count: number; // Total number of profiles followed
  subscriber_count: number; // Total number of subscribers
  content_count: number; // Total number of content items (videos, images, posts)
  content_group_count: number; // Total number of content group items (playlists, albums)
  watch_time_in_hours: number; // Total watch time in hours
}

export interface PhylloEmail {
  type: "WORK" | "OTHER" | "HOME"; // Type of the email ID
  email_id: string; // Email ID of the user
}

export interface PhylloPhoneNumber {
  type: string; // Type of the phone number
  id: string; // Phone number of the user
}

export interface PhylloAddress {
  type: "WORK" | "OTHER" | "HOME"; // Type of the address
  address: string; // Address of the user
}

// Separate interfaces for fields with periods
export interface PhylloReputationContent {
  content_count: number; // Total number of content items
  content_group_count: number; // Total number of content group items
}

export interface PhylloEmailsType {
  type: "WORK" | "OTHER" | "HOME"; // Type of the email ID
}

export interface PhylloPhoneNumbersType {
  type: string; // Type of the phone number
}

export interface PhylloAddressesType {
  type: "WORK" | "OTHER" | "HOME"; // Type of the address
}
