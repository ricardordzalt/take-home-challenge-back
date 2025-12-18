import { Test, TestingModule } from '@nestjs/testing';
import { DeleteNotificationController } from './delete-notification.controller';

describe('DeleteNotificationController', () => {
  let controller: DeleteNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteNotificationController],
    }).compile();

    controller = module.get<DeleteNotificationController>(DeleteNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
