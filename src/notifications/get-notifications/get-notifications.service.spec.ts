import { Test, TestingModule } from '@nestjs/testing';
import { GetNotificationsService } from './get-notifications.service';

describe('GetNotificationsService', () => {
  let service: GetNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetNotificationsService],
    }).compile();

    service = module.get<GetNotificationsService>(GetNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
