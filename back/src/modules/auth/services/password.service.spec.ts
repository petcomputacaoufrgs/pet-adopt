import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';
import { EncryptionService } from '../../encryption/encryption.service';

describe('PasswordService', () => {
  it('hashes a reset password before persisting it', async () => {
    const jwtService = {
      verify: jest.fn().mockReturnValue({ sub: 'user-a' }),
    } as unknown as JwtService;
    const configService = {
      get: jest.fn().mockReturnValue('reset-secret'),
    } as unknown as ConfigService;
    const tokenModel = {
      findOneAndDelete: jest.fn().mockResolvedValue({ token: 'reset-token' }),
    };
    const userService = { updatePassword: jest.fn() };
    const service = new PasswordService(
      jwtService,
      configService,
      new EncryptionService(),
      userService as never,
      {} as never,
      tokenModel as never,
    );

    await service.resetPassword('reset-token', 'NewPassword@123', jest.fn());

    const storedPassword = userService.updatePassword.mock.calls[0][1];
    expect(storedPassword).not.toBe('NewPassword@123');
    expect(
      new EncryptionService().comparePassword(
        'NewPassword@123',
        storedPassword,
      ),
    ).toBe(true);
  });

  it('rejects a reset password that fails confirmation when explicitly validated', () => {
    const service = new PasswordService(
      {} as JwtService,
      {} as ConfigService,
      {} as EncryptionService,
      {} as never,
      {} as never,
      {} as never,
    );

    expect(() =>
      service.validatePasswordMatch('NewPassword@123', 'Different@123'),
    ).toThrow('Há diferença entre as senhas.');
  });
});
