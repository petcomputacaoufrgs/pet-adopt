import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Age } from 'src/core/enums/age.enum';
import { Species } from 'src/core/enums/species.enum';
import { PaginationQueryDto } from 'src/core/dtos/pagination-query.dto';

export class PetQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  ngoId?: string;

  @IsOptional()
  @IsEnum(Age)
  age?: Age;

  @IsOptional()
  @IsEnum(Species)
  species?: Species;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
  @IsBoolean()
  forTempHome?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
  @IsBoolean()
  forAdoption?: boolean;
}

export type PetFilters = Omit<PetQueryDto, 'page' | 'limit'>;
