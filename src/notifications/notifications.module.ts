import { Logger, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();
@Module({
  imports: [
    CacheModule.register({
      store: 'redis',
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, Logger],
})
export class NotificationsModule {}
