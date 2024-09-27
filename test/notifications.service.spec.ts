import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import {
  NotificationsService,
  ONE_MINUTE_MS,
} from '../src/notifications/notifications.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotificationTypeEnum } from '../src/notifications/dto/notification-type.enum';

describe('NotificationsService', () => {
  let service;
  let cacheMock;
  let loggerMock;

  beforeEach(async () => {
    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
      store: {
        ttl: jest.fn(),
      } as any,
    };

    loggerMock = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as MockType<Logger>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheMock,
        },
        {
          provide: Logger,
          useValue: loggerMock,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('sendNotification', () => {
    it('should return false when user limit is reached', async () => {
      cacheMock.get.mockReturnValueOnce(3);

      const result = await service.sendNotification(
        NotificationTypeEnum.STATUS,
        'user1',
        'test message',
      );

      expect(cacheMock.set).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when user limit is reached', async () => {
      const result = await service.sendNotification(
        'other' as NotificationTypeEnum,
        'user1',
        'test message',
      );

      expect(cacheMock.set).not.toHaveBeenCalled();
      expect(cacheMock.get).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should increment count if user can send and return true', async () => {
      cacheMock.get.mockReturnValueOnce(1);
      cacheMock.get.mockReturnValueOnce(1);
      cacheMock.set.mockReturnValue(null);
      cacheMock.store.ttl.mockReturnValue(10);

      const result = await service.sendNotification(
        NotificationTypeEnum.STATUS,
        'user1',
        'test message',
      );

      expect(cacheMock.set).toHaveBeenCalledTimes(1);
      expect(cacheMock.set).toHaveBeenCalledWith(
        `user1+${NotificationTypeEnum.STATUS}`,
        2,
        10,
      );
      expect(result).toBe(true);
    });

    it('should return true if smsSentCount is null', async () => {
      cacheMock.get.mockReturnValueOnce(null);
      cacheMock.get.mockReturnValueOnce(null);
      cacheMock.set.mockReturnValue(null);

      const result = await service.sendNotification(
        NotificationTypeEnum.STATUS,
        'user1',
        'test message',
      );

      expect(cacheMock.set).toHaveBeenCalledTimes(1);
      expect(cacheMock.set).toHaveBeenCalledWith(
        `user1+${NotificationTypeEnum.STATUS}`,
        1,
        ONE_MINUTE_MS,
      );
      expect(result).toBe(true);
    });
  });
});

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};
