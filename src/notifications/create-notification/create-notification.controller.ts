import { Body, Controller, Post } from '@nestjs/common';
import { CreateNotificationService } from './create-notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/auth/shared/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/shared/interfaces/jwt-payload.interface';

@Controller('notifications')
export class CreateNotificationController {
  constructor(
    private readonly createNotificationService: CreateNotificationService,
  ) { }

  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @User() user: JwtPayload,
  ) {
    return this.createNotificationService.createNotification(
      user,
      createNotificationDto,
    );
  }
}
