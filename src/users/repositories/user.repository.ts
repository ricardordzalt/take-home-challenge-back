
export abstract class User {
    id: string;
    email: string;
    password?: string;
}

export class CreateUserParams {
    email: string;
    password?: string;
}

export abstract class UserRepository {
    abstract create(data: CreateUserParams): Promise<User>;
    abstract findByEmail(email: string): Promise<User | null>;
}
