import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/core/dtos/pagination-query.dto';
import { Role } from 'src/core/enums/role.enum';

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  ngoId?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
