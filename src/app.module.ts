import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageController } from 'src/image/image.controller';
import { ImageService } from 'src/image/image.service';
import { OpenAIService } from 'src/openAi/openAi.service';

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
