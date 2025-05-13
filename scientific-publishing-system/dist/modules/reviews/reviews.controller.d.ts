import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewStatus } from './entities/review.entity';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto): Promise<Review>;
    findAll(articleId?: string, reviewerId?: string, status?: ReviewStatus): Promise<[Review[], number]>;
    findOne(id: string): Promise<Review>;
    update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review>;
    remove(id: string): Promise<void>;
    getArticleReviewsSummary(articleId: string): Promise<any>;
}
