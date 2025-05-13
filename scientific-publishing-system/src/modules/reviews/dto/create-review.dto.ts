import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewStatus, ReviewRecommendation } from '../entities/review.entity';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID of the article to be reviewed' })
  @IsUUID()
  articleId: string;

  @ApiProperty({ description: 'ID of the reviewer' })
  @IsUUID()
  reviewerId: string;

  @ApiProperty({ description: 'ID of the user who assigned the review' })
  @IsUUID()
  assignedById: string;

  @ApiPropertyOptional({ description: 'Status of the review', enum: ReviewStatus })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @ApiPropertyOptional({ description: 'Recommendation for the article', enum: ReviewRecommendation })
  @IsOptional()
  @IsEnum(ReviewRecommendation)
  recommendation?: ReviewRecommendation;

  @ApiPropertyOptional({ description: 'Comments to the author' })
  @IsOptional()
  @IsString()
  commentsToAuthor?: string;

  @ApiPropertyOptional({ description: 'Comments to the editor' })
  @IsOptional()
  @IsString()
  commentsToEditor?: string;

  @ApiPropertyOptional({ description: 'URL to any file uploaded by reviewer' })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ description: 'Quality score (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  qualityScore?: number;

  @ApiPropertyOptional({ description: 'Originality score (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  originalityScore?: number;

  @ApiPropertyOptional({ description: 'Relevance score (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  relevanceScore?: number;

  @ApiPropertyOptional({ description: 'Clarity score (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  clarityScore?: number;

  @ApiPropertyOptional({ description: 'Whether review is anonymous' })
  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @ApiProperty({ description: 'Due date for the review' })
  @IsDateString()
  dueDate: string;
}