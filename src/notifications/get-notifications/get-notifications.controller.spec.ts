import { Test, TestingModule } from '@nestjs/testing';
import { GetNotificationsController } from './get-notifications.controller';

describe('GetNotificationsController', () => {
  let controller: GetNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetNotificationsController],
    }).compile();

    controller = module.get<GetNotificationsController>(GetNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
