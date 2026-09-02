import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UserService } from 'src/domain/user/user.service';
import { NgoService } from 'src/domain/ngo/ngo.service';
import { EncryptionService } from '../encryption/encryption.service';
import { TokenService } from './services/token.service';
import { PasswordService } from './services/password.service';
import { SignupService } from './services/signup.service';
import { Role } from '../../core/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: {} },
        { provide: NgoService, useValue: {} },
        { provide: EncryptionService, useValue: {} },
        { provide: TokenService, useValue: {} },
        { provide: PasswordService, useValue: {} },
        { provide: SignupService, useValue: {} },
        { provide: getConnectionToken(), useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('continues to authenticate a user after a hashed password change', async () => {
    const encryptionService = new EncryptionService();
    const hashedPassword =
      await encryptionService.encryptPassword('NewPassword@123');
    const userService = {
      getByEmail: jest.fn().mockResolvedValue({
        _id: 'user-a',
        email: 'user@example.com',
        password: hashedPassword,
        role: Role.NGO_MEMBER,
        toObject: () => ({
          _id: 'user-a',
          email: 'user@example.com',
          password: hashedPassword,
          role: Role.NGO_MEMBER,
        }),
      }),
    };
    const authService = new AuthService(
      userService as never,
      {} as never,
      encryptionService,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(
      authService.validateUser('user@example.com', 'NewPassword@123'),
    ).resolves.toEqual(
      expect.objectContaining({
        email: 'user@example.com',
        role: Role.NGO_MEMBER,
      }),
    );
  });
});
