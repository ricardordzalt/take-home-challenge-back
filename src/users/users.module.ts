import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user/create-user.service';
import { GetUserService } from './get-user/get-user.service';

@Module({
  providers: [CreateUserService, GetUserService]
})
export class UsersModule {}
