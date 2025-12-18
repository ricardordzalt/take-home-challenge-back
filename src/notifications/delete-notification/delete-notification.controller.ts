import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteNotificationService } from './delete-notification.service';
import { User } from 'src/auth/shared/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/shared/interfaces/jwt-payload.interface';

@Controller('notifications')
export class DeleteNotificationController {
  constructor(
    private readonly deleteNotificationService: DeleteNotificationService,
  ) { }

  @Delete(':notificationId')
  async deleteNotification(
    @Param('notificationId') notificationId: string,
    @User() user: JwtPayload,
  ) {
    return this.deleteNotificationService.execute(
      notificationId,
      user,
    );
  }
}
