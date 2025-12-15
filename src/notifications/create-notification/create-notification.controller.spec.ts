import { Test, TestingModule } from '@nestjs/testing';
import { CreateNotificationController } from './create-notification.controller';

describe('CreateNotificationController', () => {
  let controller: CreateNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateNotificationController],
    }).compile();

    controller = module.get<CreateNotificationController>(CreateNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
