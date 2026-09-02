import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { SelfOrNgoOwnershipGuard } from './self-or-ngo-ownership.guard';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';

describe('SelfOrNgoOwnershipGuard', () => {
  const config = {
    userIdParam: 'userId',
    allowSelf: true,
    allowNgoOwnership: false,
  };

  const contextFor = (
    user: object | undefined,
    userId: string,
  ): ExecutionContext =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user, params: { userId } }),
      }),
    }) as ExecutionContext;

  it('allows an NGO admin to update its own NGO profile', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(config),
    } as unknown as Reflector;
    const guard = new SelfOrNgoOwnershipGuard(reflector);

    expect(
      guard.canActivate(
        contextFor(
          { userId: 'ngo-a-admin', role: Role.NGO_ADMIN },
          'ngo-a-admin',
        ),
      ),
    ).toBe(true);
  });

  it('rejects an NGO admin targeting another user', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(config),
    } as unknown as Reflector;
    const guard = new SelfOrNgoOwnershipGuard(reflector);

    expect(() =>
      guard.canActivate(
        contextFor(
          { userId: 'ngo-a-admin', role: Role.NGO_ADMIN },
          'ngo-b-admin',
        ),
      ),
    ).toThrow(ForbiddenException);
  });

  it('does not authenticate an unauthenticated request', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(config),
    } as unknown as Reflector;
    const guard = new SelfOrNgoOwnershipGuard(reflector);

    expect(() =>
      guard.canActivate(contextFor(undefined, 'user-a')),
    ).not.toThrow();
    expect(() => new JwtAuthGuard().handleRequest(null, null)).toThrow(
      'Token inválido ou expirado',
    );
  });
});
