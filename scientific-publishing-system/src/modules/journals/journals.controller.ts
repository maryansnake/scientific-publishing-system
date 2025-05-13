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
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Journal } from './entities/journal.entity';
import { Issue } from './entities/issue.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('journals')
@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  // Journal Endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new journal' })
  @ApiResponse({
    status: 201,
    description: 'The journal has been successfully created.',
    type: Journal,
  })
  createJournal(@Body() createJournalDto: CreateJournalDto): Promise<Journal> {
    return this.journalsService.createJournal(createJournalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all journals' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering journals',
  })
  @ApiResponse({
    status: 200,
    description: 'List of journals',
    type: [Journal],
  })
  findAllJournals(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ): Promise<[Journal[], number]> {
    return this.journalsService.findAllJournals(paginationDto, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a journal by ID' })
  @ApiResponse({
    status: 200,
    description: 'Journal details',
    type: Journal,
  })
  findJournalById(@Param('id') id: string): Promise<Journal> {
    return this.journalsService.findJournalById(id);
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Get a journal by slug' })
  @ApiResponse({
    status: 200,
    description: 'Journal details',
    type: Journal,
  })
  findJournalBySlug(@Param('slug') slug: string): Promise<Journal> {
    return this.journalsService.findJournalBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a journal' })
  @ApiResponse({
    status: 200,
    description: 'The journal has been successfully updated.',
    type: Journal,
  })
  updateJournal(
    @Param('id') id: string,
    @Body() updateJournalDto: UpdateJournalDto,
  ): Promise<Journal> {
    return this.journalsService.updateJournal(id, updateJournalDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a journal' })
  @ApiResponse({
    status: 200,
    description: 'The journal has been successfully deleted.',
  })
  removeJournal(@Param('id') id: string): Promise<void> {
    return this.journalsService.removeJournal(id);
  }

  // Issue Endpoints
  @Post('issues')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiResponse({
    status: 201,
    description: 'The issue has been successfully created.',
    type: Issue,
  })
  createIssue(@Body() createIssueDto: CreateIssueDto): Promise<Issue> {
    return this.journalsService.createIssue(createIssueDto);
  }

  @Get(':journalId/issues')
  @ApiOperation({ summary: 'Get all issues for a journal' })
  @ApiResponse({
    status: 200,
    description: 'List of issues',
    type: [Issue],
  })
  findAllIssues(
    @Param('journalId') journalId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<[Issue[], number]> {
    return this.journalsService.findAllIssues(journalId, paginationDto);
  }

  @Get('issues/:id')
  @ApiOperation({ summary: 'Get an issue by ID' })
  @ApiResponse({
    status: 200,
    description: 'Issue details',
    type: Issue,
  })
  findIssueById(@Param('id') id: string): Promise<Issue> {
    return this.journalsService.findIssueById(id);
  }

  @Patch('issues/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an issue' })
  @ApiResponse({
    status: 200,
    description: 'The issue has been successfully updated.',
    type: Issue,
  })
  updateIssue(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<Issue> {
    return this.journalsService.updateIssue(id, updateIssueDto);
  }

  @Delete('issues/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an issue' })
  @ApiResponse({
    status: 200,
    description: 'The issue has been successfully deleted.',
  })
  removeIssue(@Param('id') id: string): Promise<void> {
    return this.journalsService.removeIssue(id);
  }
}