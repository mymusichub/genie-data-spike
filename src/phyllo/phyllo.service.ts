import { Injectable } from '@nestjs/common';
import { PhylloContentItem, PhylloUser, PhylloUserProfile } from './phyllo.types';
import { PhylloClient } from './phyllo.client';

@Injectable()
export class PhylloService {
  constructor(private readonly phylloClient: PhylloClient) {}

  async getPhylloUser(
    userId: string
  ): Promise<PhylloUser> {
    const user = await this.phylloClient.get<PhylloUser>(`/users/external_id/${userId}`); 
    return user;
  }

  async getProfiles(
    userId: string,
  ): Promise<PhylloUserProfile[]> {
    const accounts = await this.phylloClient.get<{ data: PhylloUserProfile[] }>(`/profiles?user_id=${userId}`)
    return accounts.data;
  }

  async getContentItemsByAccount(
    accountId: string
  ): Promise<PhylloContentItem[]> {
    const content = await this.phylloClient.get<{ data: PhylloContentItem[] }>(`/social/contents?account_id=${accountId}&limit=100`)
    return content.data;
  }

  selectContentByLastXDays(
    days: number,
    content: PhylloContentItem[]
  ): PhylloContentItem[] {
    const currentDate = new Date();
    const cutoffDate = new Date(currentDate);
    cutoffDate.setDate(currentDate.getDate() - days);
  
    return content.filter(item => {
      const publishedAt = new Date(item.published_at);
      return publishedAt >= cutoffDate;
    });
  }
}
