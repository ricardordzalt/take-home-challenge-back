export abstract class User {
  id: string;
  email: string;
  password?: string;
}

export type CreateUserParams = {
  email: string;
  password: string;
};

export abstract class UsersRepository {
  abstract create(data: CreateUserParams): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
