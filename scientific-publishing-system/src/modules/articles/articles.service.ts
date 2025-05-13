import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, In, ILike } from 'typeorm';
  import { Article, ArticleStatus, ArticleType } from './entities/article.entity';
  import { ArticleFile } from './entities/article-file.entity';
  import { CreateArticleDto, AuthorDTO } from './dto/create-article.dto';
  import { UpdateArticleDto } from './dto/update-article.dto';
  import { CreateArticleFileDto } from './dto/create-article-file.dto';
  import { UpdateArticleFileDto } from './dto/update-article-file.dto';
  import { UsersService } from '../users/users.service';
  import { JournalsService } from '../journals/journals.service';
  import { PaginationDto } from '../../common/dto/pagination.dto';
  import { User } from '../users/entities/user.entity';
  
  @Injectable()
  export class ArticlesService {
    constructor(
      @InjectRepository(Article)
      private articlesRepository: Repository<Article>,
      @InjectRepository(ArticleFile)
      private articleFilesRepository: Repository<ArticleFile>,
      private usersService: UsersService,
      private journalsService: JournalsService,
    ) {}
  
    // Article Methods
    async create(createArticleDto: CreateArticleDto): Promise<Article> {
      // Check if journal exists
      await this.journalsService.findJournalById(createArticleDto.journalId);
  
      // Check if issue exists if issueId provided
      if (createArticleDto.issueId) {
        await this.journalsService.findIssueById(createArticleDto.issueId);
      }
  
      // Validate submitter exists
      await this.usersService.findById(createArticleDto.submitterId);
  
      // Create base article without authors
      const article = this.articlesRepository.create({
        title: createArticleDto.title,
        abstract: createArticleDto.abstract,
        keywords: createArticleDto.keywords,
        type: createArticleDto.type || ArticleType.RESEARCH,
        status: createArticleDto.status || ArticleStatus.DRAFT,
        doi: createArticleDto.doi,
        pages: createArticleDto.pages,
        submissionDate: createArticleDto.submissionDate ? new Date(createArticleDto.submissionDate) : undefined,
        mainFileUrl: createArticleDto.mainFileUrl,
        metadata: createArticleDto.metadata,
        journalId: createArticleDto.journalId,
        issueId: createArticleDto.issueId,
        submitterId: createArticleDto.submitterId,
      });
  
      // First save to get ID
      const savedArticle = await this.articlesRepository.save(article);
      
      // Handle authors if provided
      if (createArticleDto.authors && createArticleDto.authors.length > 0) {
        // Initialize authors array
        const authors: User[] = [];
        
        for (const authorDto of createArticleDto.authors) {
          try {
            const user = await this.usersService.findById(authorDto.userId);
            authors.push(user);
          } catch (error) {
            if (error instanceof NotFoundException) {
              throw new BadRequestException(`Author with ID ${authorDto.userId} not found`);
            }
            throw error;
          }
        }
        
        // Save author relationships with the article
        savedArticle.authors = authors;
        await this.articlesRepository.save(savedArticle);
      }
  
      return await this.findById(savedArticle.id);
    }
  
    async findAll(
      paginationDto: PaginationDto,
      filters?: {
        journalId?: string;
        status?: ArticleStatus;
        search?: string;
      },
    ): Promise<[Article[], number]> {
      const page = paginationDto.page ?? 1;
      const limit = paginationDto.limit ?? 10;
      const skip = (page - 1) * limit;
  
      // Build where conditions based on filters
      let whereConditions: any = {};
      
      if (filters?.journalId) {
        whereConditions.journalId = filters.journalId;
      }
      
      if (filters?.status) {
        whereConditions.status = filters.status;
      }
      
      if (filters?.search) {
        whereConditions = [
          { ...whereConditions, title: ILike(`%${filters.search}%`) },
          { ...whereConditions, abstract: ILike(`%${filters.search}%`) },
        ];
      }
  
      return this.articlesRepository.findAndCount({
        where: whereConditions,
        skip,
        take: limit,
        relations: ['submitter', 'authors', 'journal', 'issue'],
        order: { createdAt: 'DESC' },
      });
    }
  
    async findById(id: string): Promise<Article> {
      const article = await this.articlesRepository.findOne({
        where: { id },
        relations: ['submitter', 'authors', 'journal', 'issue'],
      });
  
      if (!article) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }
  
      return article;
    }
  
    async findByIds(ids: string[]): Promise<Article[]> {
      return this.articlesRepository.find({
        where: { id: In(ids) },
        relations: ['submitter', 'authors', 'journal', 'issue'],
      });
    }
  
    async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
      const article = await this.findById(id);
  
      // Check if journal exists if changing journal
      if (updateArticleDto.journalId && updateArticleDto.journalId !== article.journalId) {
        await this.journalsService.findJournalById(updateArticleDto.journalId);
      }
  
      // Check if issue exists if changing issue
      if (updateArticleDto.issueId && updateArticleDto.issueId !== article.issueId) {
        await this.journalsService.findIssueById(updateArticleDto.issueId);
      }
  
      // Handle authors if provided
      if (updateArticleDto.authors) {
        // Initialize authors array
        const authors: User[] = [];
        
        for (const authorDto of updateArticleDto.authors) {
          try {
            const user = await this.usersService.findById(authorDto.userId);
            authors.push(user);
          } catch (error) {
            if (error instanceof NotFoundException) {
              throw new BadRequestException(`Author with ID ${authorDto.userId} not found`);
            }
            throw error;
          }
        }
        
        // Save author relationships
        article.authors = authors;
        
        // Remove authors from DTO as we handle it separately
        delete updateArticleDto.authors;
      }
  
      // Update other properties
      Object.assign(article, updateArticleDto);
  
      return this.articlesRepository.save(article);
    }
  
    async updateStatus(id: string, status: ArticleStatus): Promise<Article> {
      const article = await this.findById(id);
      
      article.status = status;
      
      // Set dates based on status
      if (status === ArticleStatus.SUBMITTED && !article.submissionDate) {
        article.submissionDate = new Date();
      } else if (status === ArticleStatus.ACCEPTED && !article.acceptanceDate) {
        article.acceptanceDate = new Date();
      } else if (status === ArticleStatus.PUBLISHED && !article.publicationDate) {
        article.publicationDate = new Date();
      }
      
      return this.articlesRepository.save(article);
    }
  
    async remove(id: string): Promise<void> {
      const result = await this.articlesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }
    }
  
    // Article File Methods
    async createFile(createArticleFileDto: CreateArticleFileDto): Promise<ArticleFile> {
      // Check if article exists
      await this.findById(createArticleFileDto.articleId);
  
      const articleFile = this.articleFilesRepository.create(createArticleFileDto);
      return this.articleFilesRepository.save(articleFile);
    }
  
    async findAllFiles(articleId: string): Promise<ArticleFile[]> {
      return this.articleFilesRepository.find({
        where: { articleId },
        order: { createdAt: 'DESC' },
      });
    }
  
    async findFileById(id: string): Promise<ArticleFile> {
      const file = await this.articleFilesRepository.findOne({
        where: { id },
        relations: ['article'],
      });
  
      if (!file) {
        throw new NotFoundException(`Article file with ID ${id} not found`);
      }
  
      return file;
    }
  
    async updateFile(id: string, updateArticleFileDto: UpdateArticleFileDto): Promise<ArticleFile> {
      const file = await this.findFileById(id);
  
      // Update file properties
      Object.assign(file, updateArticleFileDto);
  
      return this.articleFilesRepository.save(file);
    }
  
    async removeFile(id: string): Promise<void> {
      const result = await this.articleFilesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Article file with ID ${id} not found`);
      }
    }
  }