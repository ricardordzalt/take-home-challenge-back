import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

type Hash = {
    password: string;
}

type Compare = {
    password: string;
    hashed: string;
}

@Injectable()
export class HashService {
    async hash({ password }: Hash) {
        const saltOrRounds = 10;
        const hashed = await hash(password, saltOrRounds);
        return hashed;
    }

    async compare({ password, hashed }: Compare) {
        return await compare(password, hashed);
    }
}