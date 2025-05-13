import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArticleType, ArticleStatus } from '../entities/article.entity';

export class AuthorDTO {
  @ApiProperty({ description: 'User ID of author' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: 'Order of author in the list' })
  @IsOptional()
  @IsString()
  order?: string;

  @ApiPropertyOptional({ description: 'Is corresponding author' })
  @IsOptional()
  @IsBoolean()
  isCorresponding?: Boolean;
}

export class CreateArticleDto {
  @ApiProperty({ description: 'Title of the article' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Abstract of the article' })
  @IsString()
  @IsNotEmpty()
  abstract: string;

  @ApiPropertyOptional({ description: 'Keywords for the article', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Type of article', enum: ArticleType })
  @IsOptional()
  @IsEnum(ArticleType)
  type?: ArticleType;

  @ApiPropertyOptional({ description: 'Status of article', enum: ArticleStatus })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiPropertyOptional({ description: 'DOI for the article' })
  @IsOptional()
  @IsString()
  doi?: string;

  @ApiPropertyOptional({ description: 'Page numbers in the issue' })
  @IsOptional()
  @IsString()
  pages?: string;

  @ApiPropertyOptional({ description: 'Submission date' })
  @IsOptional()
  @IsDateString()
  submissionDate?: string;

  @ApiPropertyOptional({ description: 'URL to the main article file' })
  @IsOptional()
  @IsString()
  mainFileUrl?: string;

  @ApiPropertyOptional({ description: 'Additional article metadata' })
  @IsOptional()
  metadata?: any;

  @ApiProperty({ description: 'Journal ID this article belongs to' })
  @IsUUID()
  journalId: string;

  @ApiPropertyOptional({ description: 'Issue ID this article belongs to' })
  @IsOptional()
  @IsUUID()
  issueId?: string;

  @ApiProperty({ description: 'User ID of the submitter' })
  @IsUUID()
  submitterId: string;

  @ApiPropertyOptional({ description: 'Authors of the article', type: [AuthorDTO] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuthorDTO)
  authors?: AuthorDTO[];
}