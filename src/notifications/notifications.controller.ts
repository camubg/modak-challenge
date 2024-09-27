import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationRequest } from './dto/notification.request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('v1/notification')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @ApiOperation({
    summary:
      'Send notification to some user, you need the type of message + the user id + the message',
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post()
  async sendNotification(
    @Body(new ValidationPipe({ transform: true }))
    notification: NotificationRequest,
  ) {
    this.logger.debug(
      `Send Notification for: ${notification.userId}.` +
        `Type: ${notification.type}`,
      NotificationsController.name,
    );

    return this.notificationsService.sendNotification(
      notification.type,
      notification.userId,
      notification.message,
    );
  }
}
