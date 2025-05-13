import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleFileDto } from './dto/create-article-file.dto';
import { UpdateArticleFileDto } from './dto/update-article-file.dto';
import { Article, ArticleStatus } from './entities/article.entity';
import { ArticleFile, ArticleFileType } from './entities/article-file.entity';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: CreateArticleDto): Promise<Article>;
    findAll(journalId?: string, status?: ArticleStatus, search?: string): Promise<[Article[], number]>;
    findOne(id: string): Promise<Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article>;
    updateStatus(id: string, status: ArticleStatus): Promise<Article>;
    remove(id: string): Promise<void>;
    createFile(createArticleFileDto: CreateArticleFileDto): Promise<ArticleFile>;
    uploadFile(file: Express.Multer.File, articleId: string, fileType: ArticleFileType, description?: string): Promise<ArticleFile>;
    findAllFiles(articleId: string): Promise<ArticleFile[]>;
    findFileById(id: string): Promise<ArticleFile>;
    updateFile(id: string, updateArticleFileDto: UpdateArticleFileDto): Promise<ArticleFile>;
    removeFile(id: string): Promise<void>;
}
