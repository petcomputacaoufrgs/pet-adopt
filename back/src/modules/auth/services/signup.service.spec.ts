import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NgoMemberDto } from 'src/domain/user/dtos/create-user.dto';
import { Role } from 'src/core/enums/role.enum';
import { SignupService } from './signup.service';

describe('SignupService.signupNgoMember', () => {
  it('creates an independent member without an NGO', async () => {
    const userService = {
      getByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(undefined),
    };
    const passwordService = {
      validatePasswordMatch: jest.fn(),
      validatePasswordStrength: jest.fn(),
    };
    const service = new SignupService(
      userService as never,
      { getById: jest.fn() } as never,
      { encryptPassword: jest.fn().mockResolvedValue('hashed') } as never,
      passwordService as never,
      {} as never,
    );

    await service.signupNgoMember({
      name: 'Member',
      email: 'member@example.com',
      password: 'Password@123',
      confirmPassword: 'Password@123',
    });

    expect(userService.create).toHaveBeenCalledWith(
      expect.objectContaining({ role: Role.NGO_MEMBER }),
    );
    expect(userService.create.mock.calls[0][0]).not.toHaveProperty('ngoId');
  });

  it('accepts a member DTO without ngoId', async () => {
    const dto = plainToInstance(NgoMemberDto, {
      name: 'Member',
      email: 'member@example.com',
      password: 'Password@123',
      confirmPassword: 'Password@123',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });
});
