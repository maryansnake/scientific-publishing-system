import { Repository } from 'typeorm';
import { Review, ReviewStatus } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ArticlesService } from '../articles/articles.service';
import { UsersService } from '../users/users.service';
import { ArticleStatus } from '../articles/entities/article.entity';
interface ReviewScores {
    quality: number;
    originality: number;
    relevance: number;
    clarity: number;
    overall: number;
}
export declare class ReviewsService {
    private reviewsRepository;
    private articlesService;
    private usersService;
    constructor(reviewsRepository: Repository<Review>, articlesService: ArticlesService, usersService: UsersService);
    create(createReviewDto: CreateReviewDto): Promise<Review>;
    findAll(filters?: {
        articleId?: string;
        reviewerId?: string;
        status?: ReviewStatus;
    }): Promise<[Review[], number]>;
    findById(id: string): Promise<Review>;
    update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review>;
    remove(id: string): Promise<void>;
    getArticleReviewsSummary(articleId: string): Promise<{
        articleId: string;
        articleTitle: string;
        status: ArticleStatus;
        totalReviews: number;
        pendingReviews: number;
        completedReviews: number;
        averageScores: ReviewScores | null;
        recommendations: Record<string, number>;
    }>;
    private calculateAverageScore;
    private calculateOverallScore;
}
export {};
