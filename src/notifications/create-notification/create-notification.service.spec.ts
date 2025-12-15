import { Test, TestingModule } from '@nestjs/testing';
import { CreateNotificationService } from './create-notification.service';

describe('CreateNotificationService', () => {
  let service: CreateNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateNotificationService],
    }).compile();

    service = module.get<CreateNotificationService>(CreateNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
