import { Injectable } from '@nestjs/common';

// TODO: just reading statically from a json for the spike
@Injectable()
export class BigQueryService {
  async getByUserId(userId: string) {
    const data = await import('./bigquery.data.json');
    return data.find((it) => it.user_id === userId);
  }
}
