import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleFileType } from '../entities/article-file.entity';

export class CreateArticleFileDto {
  @ApiProperty({ description: 'Name of the file' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  filename: string;

  @ApiProperty({ description: 'URL where the file is stored' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ description: 'Size of file in bytes' })
  @IsInt()
  fileSize: number;

  @ApiProperty({ description: 'MIME type of the file' })
  @IsString()
  @MaxLength(100)
  mimeType: string;

  @ApiProperty({ description: 'Type of article file', enum: ArticleFileType })
  @IsEnum(ArticleFileType)
  fileType: ArticleFileType;

  @ApiPropertyOptional({ description: 'Description of the file' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Version of the file' })
  @IsOptional()
  @IsInt()
  version?: number;

  @ApiProperty({ description: 'Article ID this file belongs to' })
  @IsUUID()
  articleId: string;
}