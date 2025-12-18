import { Test, TestingModule } from '@nestjs/testing';
import { UpdateNotificationController } from './update-notification.controller';

describe('UpdateNotificationController', () => {
  let controller: UpdateNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateNotificationController],
    }).compile();

    controller = module.get<UpdateNotificationController>(UpdateNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
