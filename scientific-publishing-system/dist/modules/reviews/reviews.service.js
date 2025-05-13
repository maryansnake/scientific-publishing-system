"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const articles_service_1 = require("../articles/articles.service");
const users_service_1 = require("../users/users.service");
const article_entity_1 = require("../articles/entities/article.entity");
let ReviewsService = class ReviewsService {
    reviewsRepository;
    articlesService;
    usersService;
    constructor(reviewsRepository, articlesService, usersService) {
        this.reviewsRepository = reviewsRepository;
        this.articlesService = articlesService;
        this.usersService = usersService;
    }
    async create(createReviewDto) {
        const article = await this.articlesService.findById(createReviewDto.articleId);
        if (article.status !== article_entity_1.ArticleStatus.UNDER_REVIEW && article.status !== article_entity_1.ArticleStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Article is not in a reviewable state');
        }
        const reviewer = await this.usersService.findById(createReviewDto.reviewerId);
        const assignedBy = await this.usersService.findById(createReviewDto.assignedById);
        const existingReview = await this.reviewsRepository.findOne({
            where: {
                articleId: createReviewDto.articleId,
                reviewerId: createReviewDto.reviewerId,
                status: review_entity_1.ReviewStatus.PENDING,
            },
        });
        if (existingReview) {
            throw new common_1.ConflictException('This reviewer is already assigned to the article');
        }
        if (article.status !== article_entity_1.ArticleStatus.UNDER_REVIEW) {
            await this.articlesService.updateStatus(article.id, article_entity_1.ArticleStatus.UNDER_REVIEW);
        }
        const review = this.reviewsRepository.create({
            ...createReviewDto,
            dueDate: new Date(createReviewDto.dueDate),
            status: createReviewDto.status || review_entity_1.ReviewStatus.PENDING,
        });
        return this.reviewsRepository.save(review);
    }
    async findAll(filters) {
        const page = 1;
        const limit = 999;
        const skip = (page - 1) * limit;
        const whereConditions = {};
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
    async findById(id) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['article', 'reviewer', 'assignedBy'],
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        return review;
    }
    async update(id, updateReviewDto) {
        const review = await this.findById(id);
        if (updateReviewDto.status === review_entity_1.ReviewStatus.COMPLETED && !updateReviewDto.completionDate) {
            updateReviewDto.completionDate = new Date().toISOString();
        }
        Object.assign(review, {
            ...updateReviewDto,
            dueDate: updateReviewDto.dueDate ? new Date(updateReviewDto.dueDate) : review.dueDate,
            completionDate: updateReviewDto.completionDate
                ? new Date(updateReviewDto.completionDate)
                : review.completionDate,
        });
        return this.reviewsRepository.save(review);
    }
    async remove(id) {
        const result = await this.reviewsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
    }
    async getArticleReviewsSummary(articleId) {
        const article = await this.articlesService.findById(articleId);
        const reviews = await this.reviewsRepository.find({
            where: { articleId },
            relations: ['reviewer'],
        });
        const pendingReviews = reviews.filter(r => r.status === review_entity_1.ReviewStatus.PENDING).length;
        const completedReviews = reviews.filter(r => r.status === review_entity_1.ReviewStatus.COMPLETED);
        let averageScores = null;
        if (completedReviews.length > 0) {
            const scores = {
                quality: this.calculateAverageScore(completedReviews, 'qualityScore'),
                originality: this.calculateAverageScore(completedReviews, 'originalityScore'),
                relevance: this.calculateAverageScore(completedReviews, 'relevanceScore'),
                clarity: this.calculateAverageScore(completedReviews, 'clarityScore'),
                overall: this.calculateOverallScore(completedReviews),
            };
            averageScores = scores;
        }
        const recommendations = completedReviews.reduce((acc, review) => {
            if (review.recommendation) {
                acc[review.recommendation] = (acc[review.recommendation] || 0) + 1;
            }
            return acc;
        }, {});
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
    calculateAverageScore(reviews, scoreField) {
        const scores = reviews
            .map(r => r[scoreField])
            .filter(s => s !== null && s !== undefined);
        if (scores.length === 0)
            return 0;
        const sum = scores.reduce((acc, curr) => acc + curr, 0);
        return Math.round((sum / scores.length) * 10) / 10;
    }
    calculateOverallScore(reviews) {
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
        if (scores.length === 0)
            return 0;
        const sum = scores.reduce((acc, curr) => acc + curr, 0);
        return Math.round((sum / scores.length) * 10) / 10;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        articles_service_1.ArticlesService,
        users_service_1.UsersService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map