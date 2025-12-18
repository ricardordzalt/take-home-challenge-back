import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const tokenService = { verifyToken: () => { } } as any;
    const reflector = { getAllAndOverride: () => { } } as any;
    const usersRepository = { findById: () => { } } as any;
    expect(new JwtAuthGuard(tokenService, reflector, usersRepository)).toBeDefined();
  });
});
