import { Test, TestingModule } from '@nestjs/testing';
import { UpdateNotificationService } from './update-notification.service';

describe('UpdateNotificationService', () => {
  let service: UpdateNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateNotificationService],
    }).compile();

    service = module.get<UpdateNotificationService>(UpdateNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
