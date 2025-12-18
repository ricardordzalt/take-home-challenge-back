import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../shared/decorators/public.decorator';

@Controller('auth/login')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Public()
    @Post()
    async execute(
        @Body() loginBody: LoginDto,
    ) {
        return this.loginService.execute(loginBody);
    }
}
