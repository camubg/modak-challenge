import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { NotificationTypeEnum } from './dto/notification-type.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RateLimitRule } from './dto/rate-limit-rule';
import * as process from 'process';

export const ONE_MINUTE_MS: number = 60 * 1000;
export const ONE_HOUR_MS: number = 60 * ONE_MINUTE_MS;
export const ONE_DAY_MS: number = 24 * ONE_HOUR_MS;

@Injectable()
export class NotificationsService {
  private readonly rateLimitRules: Map<NotificationTypeEnum, RateLimitRule> =
    new Map();
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.initRateLimitRules();
  }
  async sendNotification(
    type: NotificationTypeEnum,
    userId: string,
    message: string,
  ): Promise<boolean> {
    if (!(await this.canSendSms(type, userId))) {
      this.logger.log(`User limit reached for type: ${type}`);
      return false;
    }

    try {
      this.logger.log(`[wip] Sending sms... ${message}`);
    } catch (e) {
      this.logger.error(
        `Error sending sms to ${userId}, type: ${type}`,
        e.message,
      );
      throw new InternalServerErrorException(
        `Error sending sms to ${userId}, type: ${type}`,
      );
    }

    await this.incrementCount(type, userId);
    return true;
  }

  private initRateLimitRules() {
    this.rateLimitRules.set(
      NotificationTypeEnum.STATUS,
      new RateLimitRule(
        Number(process.env.STATUS_LIMIT) ?? 2,
        Number(process.env.STATUS_TIME) ?? ONE_MINUTE_MS,
      ),
    );
    this.rateLimitRules.set(
      NotificationTypeEnum.NEWS,
      new RateLimitRule(
        Number(process.env.NEWS_LIMIT) ?? 1,
        Number(process.env.NEWS_TIME) ?? ONE_DAY_MS,
      ),
    );
    this.rateLimitRules.set(
      NotificationTypeEnum.MARKETING,
      new RateLimitRule(
        Number(process.env.MKT_LIMIT) ?? 3,
        Number(process.env.MKT_TIME) ?? ONE_HOUR_MS,
      ),
    );
  }

  private async canSendSms(
    type: NotificationTypeEnum,
    userId: string,
  ): Promise<boolean> {
    const rateLimit = this.rateLimitRules.get(type);
    if (!rateLimit) return true;

    const smsSentCount: number = await this.cacheManager.get(
      this.getKey(userId, type),
    );

    if (!smsSentCount) return true;
    return smsSentCount < rateLimit.limit;
  }

  private getKey(userId: string, type: NotificationTypeEnum): string {
    return `${userId.toLowerCase()}+${type}`;
  }

  private async incrementCount(
    type: NotificationTypeEnum,
    userId: string,
  ): Promise<void> {
    const rateLimit = this.rateLimitRules.get(type);
    if (!rateLimit) return;

    const key = this.getKey(userId, type);
    const smsSentCount: number = (await this.cacheManager.get(key)) ?? 0;

    const ttl: number =
      smsSentCount === 0 ? rateLimit.timeWindowMs : await this.getTtl(key);
    await this.cacheManager.set(key, smsSentCount + 1, ttl);
  }

  private async getTtl(key: string): Promise<number> {
    const client = this.cacheManager.store;
    return client.ttl(key);
  }
}
