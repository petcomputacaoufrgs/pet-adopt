import { BasicUserDto } from './create-user.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(
  OmitType(BasicUserDto, ['password', 'confirmPassword'] as const),
) {}
