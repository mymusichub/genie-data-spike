import { Module } from '@nestjs/common';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';
import { OpenAIService } from './openAi/openAi.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, 
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService, OpenAIService],
})
export class AppModule {}
