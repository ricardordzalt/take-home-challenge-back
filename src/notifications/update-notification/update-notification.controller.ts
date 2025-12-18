import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateNotificationService } from './update-notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from 'src/auth/shared/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/shared/interfaces/jwt-payload.interface';

@Controller('notifications')
export class UpdateNotificationController {
  constructor(
    private readonly updateNotificationService: UpdateNotificationService,
  ) { }

  @Put(':notificationId')
  async updateNotification(
    @Param('notificationId') notificationId: string,
    @Body() updateNotificationBody: UpdateNotificationDto,
    @User() user: JwtPayload,
  ) {
    return this.updateNotificationService.updateNotification(
      notificationId,
      updateNotificationBody,
      user,
    );
  }
}
