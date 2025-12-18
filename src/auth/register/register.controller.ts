import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../shared/decorators/public.decorator';

@Controller('auth/register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerBody: RegisterDto) {
        return this.registerService.execute(registerBody);
    }
}
