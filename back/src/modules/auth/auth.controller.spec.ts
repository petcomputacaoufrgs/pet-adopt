import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from '../../core/enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('protects NGO profile updates with role and self ownership metadata', () => {
    expect(Reflect.getMetadata('roles', controller.updateNgoInfo)).toEqual([
      Role.NGO_ADMIN,
    ]);
    expect(
      Reflect.getMetadata('selfOrNgoOwnership', controller.updateNgoInfo),
    ).toEqual(
      expect.objectContaining({
        userIdParam: 'userId',
        allowSelf: true,
        allowNgoOwnership: false,
      }),
    );
  });
});
