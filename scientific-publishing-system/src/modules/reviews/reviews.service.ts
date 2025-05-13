import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus, ReviewRecommendation } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ArticlesService } from '../articles/articles.service';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ArticleStatus } from '../articles/entities/article.entity';

interface ReviewScores {
  quality: number;
  originality: number;
  relevance: number;
  clarity: number;
  overall: number;
}

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private articlesService: ArticlesService,
    private usersService: UsersService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Check if article exists
    const article = await this.articlesService.findById(createReviewDto.articleId);
    
    // Check if the article status is appropriate for review
    if (article.status !== ArticleStatus.UNDER_REVIEW && article.status !== ArticleStatus.SUBMITTED) {
      throw new BadRequestException('Article is not in a reviewable state');
    }

    // Check if reviewer exists
    const reviewer = await this.usersService.findById(createReviewDto.reviewerId);
    
    // Check if assigned by user exists
    const assignedBy = await this.usersService.findById(createReviewDto.assignedById);
    
    // Check if the reviewer is already assigned to this article
    const existingReview = await this.reviewsRepository.findOne({
      where: {
        articleId: createReviewDto.articleId,
        reviewerId: createReviewDto.reviewerId,
        status: ReviewStatus.PENDING,
      },
    });
    
    if (existingReview) {
      throw new ConflictException('This reviewer is already assigned to the article');
    }

    // Update article status to UNDER_REVIEW if it's not already
    if (article.status !== ArticleStatus.UNDER_REVIEW) {
      await this.articlesService.updateStatus(article.id, ArticleStatus.UNDER_REVIEW);
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      dueDate: new Date(createReviewDto.dueDate),
      status: createReviewDto.status || ReviewStatus.PENDING,
    });

    return this.reviewsRepository.save(review);
  }

  async findAll(
    filters?: { articleId?: string; reviewerId?: string; status?: ReviewStatus },
  ): Promise<[Review[], number]> {
    const page = 1;
    const limit = 999;
    const skip = (page - 1) * limit;

    const whereConditions: any = {};
    
    if (filters?.articleId) {
      whereConditions.articleId = filters.articleId;
    }
    
    if (filters?.reviewerId) {
      whereConditions.reviewerId = filters.reviewerId;
    }
    
    if (filters?.status) {
      whereConditions.status = filters.status;
    }

    return this.reviewsRepository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      relations: ['article', 'reviewer', 'assignedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['article', 'reviewer', 'assignedBy'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findById(id);

    // If updating to completed status, set completion date if not provided
    if (updateReviewDto.status === ReviewStatus.COMPLETED && !updateReviewDto.completionDate) {
      updateReviewDto.completionDate = new Date().toISOString();
    }

    // Update review properties
    Object.assign(review, {
      ...updateReviewDto,
      dueDate: updateReviewDto.dueDate ? new Date(updateReviewDto.dueDate) : review.dueDate,
      completionDate: updateReviewDto.completionDate 
        ? new Date(updateReviewDto.completionDate) 
        : review.completionDate,
    });

    return this.reviewsRepository.save(review);
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }

  // Helper methods for article review workflow
  async getArticleReviewsSummary(articleId: string): Promise<{
    articleId: string;
    articleTitle: string;
    status: ArticleStatus;
    totalReviews: number;
    pendingReviews: number;
    completedReviews: number;
    averageScores: ReviewScores | null;
    recommendations: Record<string, number>;
  }> {
    const article = await this.articlesService.findById(articleId);
    const reviews = await this.reviewsRepository.find({
      where: { articleId },
      relations: ['reviewer'],
    });

    const pendingReviews = reviews.filter(r => r.status === ReviewStatus.PENDING).length;
    const completedReviews = reviews.filter(r => r.status === ReviewStatus.COMPLETED);

    // Calculate average scores if there are completed reviews
    let averageScores: ReviewScores | null = null;

    if (completedReviews.length > 0) {
      // Create a new object for scores with correct type
      const scores: ReviewScores = {
        quality: this.calculateAverageScore(completedReviews, 'qualityScore'),
        originality: this.calculateAverageScore(completedReviews, 'originalityScore'),
        relevance: this.calculateAverageScore(completedReviews, 'relevanceScore'),
        clarity: this.calculateAverageScore(completedReviews, 'clarityScore'),
        overall: this.calculateOverallScore(completedReviews),
      };
      
      averageScores = scores;
    }

    // Count recommendations
    const recommendations = completedReviews.reduce((acc, review) => {
      if (review.recommendation) {
        acc[review.recommendation] = (acc[review.recommendation] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      articleId: article.id,
      articleTitle: article.title,
      status: article.status,
      totalReviews: reviews.length,
      pendingReviews,
      completedReviews: completedReviews.length,
      averageScores,
      recommendations,
    };
  }

  private calculateAverageScore(reviews: Review[], scoreField: string): number {
    const scores = reviews
      .map(r => r[scoreField])
      .filter(s => s !== null && s !== undefined);
    
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / scores.length) * 10) / 10; // Round to 1 decimal place
  }

  private calculateOverallScore(reviews: Review[]): number {
    const scores = reviews.map(review => {
      let sum = 0;
      let count = 0;
      
      ['qualityScore', 'originalityScore', 'relevanceScore', 'clarityScore'].forEach(field => {
        if (review[field] !== null && review[field] !== undefined) {
          sum += review[field];
          count++;
        }
      });
      
      return count > 0 ? sum / count : 0;
    }).filter(s => s !== null);
    
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / scores.length) * 10) / 10;
  }
}