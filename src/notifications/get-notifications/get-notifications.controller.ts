import { Controller, Get } from '@nestjs/common';
import { User } from 'src/auth/shared/decorators/user.decorator';
import { GetNotificationsService } from './get-notifications.service';
import { type JwtPayload } from 'src/auth/shared/interfaces/jwt-payload.interface';

@Controller('notifications')
export class GetNotificationsController {
    constructor(
        private readonly getNotificationsService: GetNotificationsService,
    ) { }

    @Get()
    async getNotifications(
        @User() user: JwtPayload,
    ) {
        return this.getNotificationsService.execute(user);
    }
}
