import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageController } from 'src/image/image.controller';
import { ImageService } from 'src/image/image.service';
import { OpenAIService } from 'src/openAi/openAi.service';
import { OpenAIClient } from './openAi/openAiClient';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService, OpenAIService, OpenAIClient],
})
export class AppModule {}
