import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('hashes and validates a password', async () => {
    const password = 'Senha@123';
    const hash = await service.encryptPassword(password);

    expect(hash).not.toBe(password);
    expect(service.comparePassword(password, hash)).toBe(true);
    expect(service.comparePassword('Senha@124', hash)).toBe(false);
  });
});
