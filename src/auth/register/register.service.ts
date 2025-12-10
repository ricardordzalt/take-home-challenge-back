import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class RegisterService {
    async register(payload: RegisterDto) {
        return payload;
    }
}
