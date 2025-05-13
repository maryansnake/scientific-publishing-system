import { Repository } from 'typeorm';
import { Article, ArticleStatus } from './entities/article.entity';
import { ArticleFile } from './entities/article-file.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleFileDto } from './dto/create-article-file.dto';
import { UpdateArticleFileDto } from './dto/update-article-file.dto';
import { UsersService } from '../users/users.service';
import { JournalsService } from '../journals/journals.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ArticlesService {
    private articlesRepository;
    private articleFilesRepository;
    private usersService;
    private journalsService;
    constructor(articlesRepository: Repository<Article>, articleFilesRepository: Repository<ArticleFile>, usersService: UsersService, journalsService: JournalsService);
    create(createArticleDto: CreateArticleDto): Promise<Article>;
    findAll(paginationDto: PaginationDto, filters?: {
        journalId?: string;
        status?: ArticleStatus;
        search?: string;
    }): Promise<[Article[], number]>;
    findById(id: string): Promise<Article>;
    findByIds(ids: string[]): Promise<Article[]>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article>;
    updateStatus(id: string, status: ArticleStatus): Promise<Article>;
    remove(id: string): Promise<void>;
    createFile(createArticleFileDto: CreateArticleFileDto): Promise<ArticleFile>;
    findAllFiles(articleId: string): Promise<ArticleFile[]>;
    findFileById(id: string): Promise<ArticleFile>;
    updateFile(id: string, updateArticleFileDto: UpdateArticleFileDto): Promise<ArticleFile>;
    removeFile(id: string): Promise<void>;
}
