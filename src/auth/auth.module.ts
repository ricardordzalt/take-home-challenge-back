import { Module } from '@nestjs/common';
import { RegisterController } from './register/register.controller';
import { LoginController } from './login/login.controller';
import { RegisterService } from './register/register.service';
import { LoginService } from './login/login.service';
import { HashService } from './shared/hash.service';
import { TokenService } from './shared/token.service';

@Module({
  controllers: [RegisterController, LoginController],
  providers: [
    RegisterService,
    LoginService,
    HashService,
    TokenService,
  ]
})
export class AuthModule { }
