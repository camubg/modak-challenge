import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule {}
