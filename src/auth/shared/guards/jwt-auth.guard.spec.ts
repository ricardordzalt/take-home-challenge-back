import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const tokenService = { verifyToken: () => { } } as any;
    const reflector = { getAllAndOverride: () => { } } as any;
    expect(new JwtAuthGuard(tokenService, reflector)).toBeDefined();
  });
});
