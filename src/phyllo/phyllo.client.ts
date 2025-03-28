import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PhylloClient {
  apiBaseUrl: string;
  apiToken: string;

  constructor(private configService: ConfigService) {
    this.apiBaseUrl = 'https://api.staging.getphyllo.com/v1';
    this.apiToken = btoa(
      this.configService.getOrThrow(
        'PHYLLO_API_TOKEN',
        'PHYLLO API TOKEN is not set in the environment variables.',
      ),
    );
  }

  async get<T extends {}>(url: string): Promise<T> {
    const response = await fetch(`${this.apiBaseUrl}${url}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(response, await response.json());
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  async post<T extends {}>(url: string, body: string): Promise<T> {
    const response = await fetch(`${this.apiBaseUrl}/${url}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!response.ok) {
      console.log(await response.json());
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as T;
  }
}
