import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [NotificationsModule, AuthModule],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule {}
