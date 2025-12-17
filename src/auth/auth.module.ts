import { Module } from '@nestjs/common';
import { RegisterController } from './register/register.controller';
import { LoginController } from './login/login.controller';
import { RegisterService } from './register/register.service';
import { LoginService } from './login/login.service';
import { TokenService } from './shared/token/token.service';
import { HashService } from './shared/hash/hash.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          expiresIn: '1h',
        },
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [RegisterController, LoginController],
  providers: [
    RegisterService,
    LoginService,
    HashService,
    TokenService,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard]
})
export class AuthModule { } 
