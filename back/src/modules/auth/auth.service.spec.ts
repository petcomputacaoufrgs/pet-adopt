import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UserService } from 'src/domain/user/user.service';
import { NgoService } from 'src/domain/ngo/ngo.service';
import { EncryptionService } from '../encryption/encryption.service';
import { TokenService } from './services/token.service';
import { PasswordService } from './services/password.service';
import { SignupService } from './services/signup.service';

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
});
