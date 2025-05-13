import { PartialType } from '@nestjs/swagger';
import { CreateArticleFileDto } from './create-article-file.dto';

export class UpdateArticleFileDto extends PartialType(CreateArticleFileDto) {}