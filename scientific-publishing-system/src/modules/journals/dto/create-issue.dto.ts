import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IssueStatus } from '../entities/issue.entity';

export class CreateIssueDto {
  @ApiProperty({ description: 'Title of the issue' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Description of the issue' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Cover image URL for the issue' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ description: 'Volume number' })
  @IsNumber()
  volume: number;

  @ApiProperty({ description: 'Issue number within volume' })
  @IsNumber()
  number: number;

  @ApiPropertyOptional({ description: 'Publication date', type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publicationDate?: Date;

  @ApiPropertyOptional({ description: 'Status of the issue', enum: IssueStatus })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @ApiPropertyOptional({ description: 'DOI identifier for the issue' })
  @IsOptional()
  @IsString()
  doi?: string;

  @ApiProperty({ description: 'Journal ID this issue belongs to' })
  @IsString()
  @IsNotEmpty()
  journalId: string;
}