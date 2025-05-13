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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleFileDto } from './dto/create-article-file.dto';
import { UpdateArticleFileDto } from './dto/update-article-file.dto';
import { Article, ArticleStatus } from './entities/article.entity';
import { ArticleFile, ArticleFileType } from './entities/article-file.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Article Endpoints
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
    type: Article,
  })
  create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles with filtering options' })
  @ApiQuery({
    name: 'journalId',
    required: false,
    description: 'Filter articles by journal ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter articles by status',
    enum: ArticleStatus,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in article title and abstract',
  })
  @ApiResponse({
    status: 200,
    description: 'List of articles',
    type: [Article],
  })
  findAll(
    @Query('journalId') journalId?: string,
    @Query('status') status?: ArticleStatus,
    @Query('search') search?: string,
  ): Promise<[Article[], number]> {
    return this.articlesService.findAll({page: 1, limit: 999}, { journalId, status, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by ID' })
  @ApiResponse({
    status: 200,
    description: 'Article details',
    type: Article,
  })
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an article' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully updated.',
    type: Article,
  })
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update article status' })
  @ApiResponse({
    status: 200,
    description: 'Article status updated successfully.',
    type: Article,
  })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ArticleStatus,
  ): Promise<Article> {
    return this.articlesService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an article' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.articlesService.remove(id);
  }

  // Article File Endpoints
  @Post('files')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new article file entry' })
  @ApiResponse({
    status: 201,
    description: 'The article file has been successfully created.',
    type: ArticleFile,
  })
  createFile(@Body() createArticleFileDto: CreateArticleFileDto): Promise<ArticleFile> {
    return this.articlesService.createFile(createArticleFileDto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        articleId: {
          type: 'string',
        },
        fileType: {
          type: 'string',
          enum: Object.values(ArticleFileType),
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a file for an article' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueFileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(pdf|msword|vnd.openxmlformats|plain|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Unsupported file type'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('articleId') articleId: string,
    @Body('fileType') fileType: ArticleFileType,
    @Body('description') description?: string,
  ): Promise<ArticleFile> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileUrl = `/uploads/${file.filename}`;
    
    const createFileDto: CreateArticleFileDto = {
      filename: file.originalname,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileType,
      description,
      articleId,
    };

    return this.articlesService.createFile(createFileDto);
  }

  @Get(':articleId/files')
  @ApiOperation({ summary: 'Get all files for an article' })
  @ApiResponse({
    status: 200,
    description: 'List of article files',
    type: [ArticleFile],
  })
  findAllFiles(@Param('articleId') articleId: string): Promise<ArticleFile[]> {
    return this.articlesService.findAllFiles(articleId);
  }

  @Get('files/:id')
  @ApiOperation({ summary: 'Get a file by ID' })
  @ApiResponse({
    status: 200,
    description: 'File details',
    type: ArticleFile,
  })
  findFileById(@Param('id') id: string): Promise<ArticleFile> {
    return this.articlesService.findFileById(id);
  }

  @Patch('files/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a file' })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully updated.',
    type: ArticleFile,
  })
  updateFile(
    @Param('id') id: string,
    @Body() updateArticleFileDto: UpdateArticleFileDto,
  ): Promise<ArticleFile> {
    return this.articlesService.updateFile(id, updateArticleFileDto);
  }

  @Delete('files/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully deleted.',
  })
  removeFile(@Param('id') id: string): Promise<void> {
    return this.articlesService.removeFile(id);
  }
}