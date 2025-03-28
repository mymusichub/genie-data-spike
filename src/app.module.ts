import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalysisService } from 'src/analysis/analysis.service';
import { OpenAIService } from 'src/openAi/openAi.service';
import { OpenAIClient } from './openAi/openAi.client';
import { AppController } from './app.controller';
import { PhylloService } from './phyllo/phyllo.service';
import { PhylloClient } from './phyllo/phyllo.client';
import { BigQueryService } from './bigquery/bigquery.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AnalysisService, OpenAIService, OpenAIClient, PhylloService, PhylloClient, BigQueryService],
})
export class AppModule {}
