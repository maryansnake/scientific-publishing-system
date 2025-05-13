import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsArray,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ description: 'Email of the user', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiPropertyOptional({ description: 'Roles of the user', enum: UserRole, isArray: true })
  @IsOptional()
  @IsEnum(UserRole, { each: true })
  @IsArray()
  roles?: UserRole[];

  @ApiPropertyOptional({ description: 'Institution of the user' })
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiPropertyOptional({ description: 'ORCID ID of the user' })
  @IsOptional()
  @IsString()
  orcidId?: string;

  @ApiPropertyOptional({ description: 'Academic degree of the user' })
  @IsOptional()
  @IsString()
  academicDegree?: string;

  @ApiPropertyOptional({ description: 'Biography of the user' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;
}