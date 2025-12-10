import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth/register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    @Post()
    async register(@Body() registerBody: RegisterDto) {
        return this.registerService.register(registerBody);
    }
}
