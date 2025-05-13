import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, ILike, Not, Equal } from 'typeorm';
  import { Journal } from './entities/journal.entity';
  import { Issue } from './entities/issue.entity';
  import { CreateJournalDto } from './dto/create-journal.dto';
  import { UpdateJournalDto } from './dto/update-journal.dto';
  import { CreateIssueDto } from './dto/create-issue.dto';
  import { UpdateIssueDto } from './dto/update-issue.dto';
  import { UsersService } from '../users/users.service';
  import { PaginationDto } from '../../common/dto/pagination.dto';
  
  @Injectable()
  export class JournalsService {
    constructor(
      @InjectRepository(Journal)
      private journalsRepository: Repository<Journal>,
      @InjectRepository(Issue)
      private issuesRepository: Repository<Issue>,
      private usersService: UsersService,
    ) {}
  
    // Journal Methods
    async createJournal(createJournalDto: CreateJournalDto): Promise<Journal> {
      // Check if journal with the same slug already exists
      const existingJournal = await this.journalsRepository.findOne({
        where: { slug: createJournalDto.slug },
      });
  
      if (existingJournal) {
        throw new ConflictException('Journal with this slug already exists');
      }
  
      // Create new journal instance
      const journal = this.journalsRepository.create(createJournalDto);
  
      // If editor IDs are provided, assign editors to the journal
      if (createJournalDto.editorIds && createJournalDto.editorIds.length > 0) {
        journal.editors = [];
        for (const editorId of createJournalDto.editorIds) {
          try {
            const editor = await this.usersService.findById(editorId);
            journal.editors.push(editor);
          } catch (error) {
            if (error instanceof NotFoundException) {
              throw new BadRequestException(`Editor with ID ${editorId} not found`);
            }
            throw error;
          }
        }
      }
  
      return this.journalsRepository.save(journal);
    }
  
    async findAllJournals(paginationDto: PaginationDto, search?: string): Promise<[Journal[], number]> {
      const page = paginationDto.page ?? 1;
      const limit = paginationDto.limit ?? 10;
      const skip = (page - 1) * limit;
  
      let whereCondition = {};
      if (search) {
        whereCondition = [
          { title: ILike(`%${search}%`) },
          { description: ILike(`%${search}%`) },
          { publisher: ILike(`%${search}%`) },
        ];
      }
  
      return this.journalsRepository.findAndCount({
        where: whereCondition,
        skip,
        take: limit,
        relations: ['editors'],
        order: { createdAt: 'DESC' },
      });
    }
  
    async findJournalById(id: string): Promise<Journal> {
      const journal = await this.journalsRepository.findOne({
        where: { id },
        relations: ['editors'],
      });
  
      if (!journal) {
        throw new NotFoundException(`Journal with ID ${id} not found`);
      }
  
      return journal;
    }
  
    async findJournalBySlug(slug: string): Promise<Journal> {
      const journal = await this.journalsRepository.findOne({
        where: { slug },
        relations: ['editors'],
      });
  
      if (!journal) {
        throw new NotFoundException(`Journal with slug ${slug} not found`);
      }
  
      return journal;
    }
  
    async updateJournal(id: string, updateJournalDto: UpdateJournalDto): Promise<Journal> {
      const journal = await this.findJournalById(id);
  
      // Check if slug is being updated and it's not taken
      if (updateJournalDto.slug && updateJournalDto.slug !== journal.slug) {
        const existingJournal = await this.journalsRepository.findOne({
          where: { slug: updateJournalDto.slug },
        });
  
        if (existingJournal) {
          throw new ConflictException('Journal with this slug already exists');
        }
      }
  
      // Handle editor updates if provided
      if (updateJournalDto.editorIds) {
        journal.editors = [];
        for (const editorId of updateJournalDto.editorIds) {
          try {
            const editor = await this.usersService.findById(editorId);
            journal.editors.push(editor);
          } catch (error) {
            if (error instanceof NotFoundException) {
              throw new BadRequestException(`Editor with ID ${editorId} not found`);
            }
            throw error;
          }
        }
        
        // Remove editorIds from DTO as we handle it separately
        delete updateJournalDto.editorIds;
      }
  
      // Update journal properties
      Object.assign(journal, updateJournalDto);
  
      return this.journalsRepository.save(journal);
    }
  
    async removeJournal(id: string): Promise<void> {
      const result = await this.journalsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Journal with ID ${id} not found`);
      }
    }
  
    // Issue Methods
    async createIssue(createIssueDto: CreateIssueDto): Promise<Issue> {
      // Check if journal exists
      await this.findJournalById(createIssueDto.journalId);
  
      // Check if issue with same volume and number already exists
      const existingIssue = await this.issuesRepository.findOne({
        where: {
          journalId: createIssueDto.journalId,
          volume: createIssueDto.volume,
          number: createIssueDto.number,
        },
      });
  
      if (existingIssue) {
        throw new ConflictException(
          `Issue with volume ${createIssueDto.volume} and number ${createIssueDto.number} already exists for this journal`,
        );
      }
  
      const issue = this.issuesRepository.create(createIssueDto);
      return this.issuesRepository.save(issue);
    }
  
    async findAllIssues(
      journalId: string,
      paginationDto: PaginationDto,
    ): Promise<[Issue[], number]> {
      const page = paginationDto.page ?? 1;
      const limit = paginationDto.limit ?? 10;
      const skip = (page - 1) * limit;
  
      return this.issuesRepository.findAndCount({
        where: { journalId },
        skip,
        take: limit,
        order: { volume: 'DESC', number: 'DESC' },
      });
    }
  
    async findIssueById(id: string): Promise<Issue> {
      const issue = await this.issuesRepository.findOne({
        where: { id },
        relations: ['journal'],
      });
  
      if (!issue) {
        throw new NotFoundException(`Issue with ID ${id} not found`);
      }
  
      return issue;
    }
  
    async updateIssue(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
      const issue = await this.findIssueById(id);
  
      // If changing journal ID, check if new journal exists
      if (updateIssueDto.journalId && updateIssueDto.journalId !== issue.journalId) {
        await this.findJournalById(updateIssueDto.journalId);
      }
  
      // If changing volume or number, check for duplicates
      if (
        (updateIssueDto.volume && updateIssueDto.volume !== issue.volume) ||
        (updateIssueDto.number && updateIssueDto.number !== issue.number)
      ) {
        const journalId = updateIssueDto.journalId || issue.journalId;
        const volume = updateIssueDto.volume || issue.volume;
        const number = updateIssueDto.number || issue.number;
  
        // Використовуємо Not та Equal операторів TypeORM
        const existingIssue = await this.issuesRepository.findOne({
          where: {
            journalId,
            volume,
            number,
            id: Not(Equal(id)),
          },
        });
  
        if (existingIssue) {
          throw new ConflictException(
            `Issue with volume ${volume} and number ${number} already exists for this journal`,
          );
        }
      }
  
      // Update issue
      Object.assign(issue, updateIssueDto);
      return this.issuesRepository.save(issue);
    }
  
    async removeIssue(id: string): Promise<void> {
      const result = await this.issuesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Issue with ID ${id} not found`);
      }
    }
  }