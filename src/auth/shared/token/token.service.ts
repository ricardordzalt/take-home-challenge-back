import { Injectable } from '@nestjs/common';
import {
    JwtService,
    JwtSignOptions,
    JwtVerifyOptions
} from '@nestjs/jwt';

type GenerateToken = {
    payload: any;
    options?: JwtSignOptions;
}

type VerifyToken = {
    token: string;
    options?: JwtVerifyOptions;
}

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) { }

    generateToken({ payload, options }: GenerateToken) {
        return this.jwtService.sign(payload, options);
    }

    verifyToken({ token, options }: VerifyToken) {
        return this.jwtService.verify(token, options);
    }
}
