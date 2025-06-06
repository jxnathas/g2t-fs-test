import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
  
  @IsOptional()
  email?: string;
  
  @IsOptional()
  name?: string;
  
  @IsOptional()
  role?: UserRole;
}