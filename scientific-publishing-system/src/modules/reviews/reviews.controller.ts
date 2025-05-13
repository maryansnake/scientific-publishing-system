import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewStatus } from './entities/review.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review assignment' })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
    type: Review,
  })
  create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews with filtering options' })
  @ApiQuery({
    name: 'articleId',
    required: false,
    description: 'Filter reviews by article ID',
  })
  @ApiQuery({
    name: 'reviewerId',
    required: false,
    description: 'Filter reviews by reviewer ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter reviews by status',
    enum: ReviewStatus,
  })
  @ApiResponse({
    status: 200,
    description: 'List of reviews',
    type: [Review],
  })
  findAll(
    @Query('articleId') articleId?: string,
    @Query('reviewerId') reviewerId?: string,
    @Query('status') status?: ReviewStatus,
  ): Promise<[Review[], number]> {
    return this.reviewsService.findAll({ articleId, reviewerId, status });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'Review details',
    type: Review,
  })
  findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully updated.',
    type: Review,
  })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.reviewsService.remove(id);
  }

  @Get('summary/:articleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get review summary for an article' })
  @ApiResponse({
    status: 200,
    description: 'Article review summary',
  })
  getArticleReviewsSummary(@Param('articleId') articleId: string): Promise<any> {
    return this.reviewsService.getArticleReviewsSummary(articleId);
  }
}