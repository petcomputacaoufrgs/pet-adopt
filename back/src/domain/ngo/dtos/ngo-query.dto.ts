import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/core/dtos/pagination-query.dto';

export class NgoQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}
