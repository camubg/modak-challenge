import { Logger, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      store: 'redis',
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, Logger],
})
export class NotificationsModule {}
