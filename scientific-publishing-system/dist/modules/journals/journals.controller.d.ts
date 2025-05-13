import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Journal } from './entities/journal.entity';
import { Issue } from './entities/issue.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class JournalsController {
    private readonly journalsService;
    constructor(journalsService: JournalsService);
    createJournal(createJournalDto: CreateJournalDto): Promise<Journal>;
    findAllJournals(paginationDto: PaginationDto, search?: string): Promise<[Journal[], number]>;
    findJournalById(id: string): Promise<Journal>;
    findJournalBySlug(slug: string): Promise<Journal>;
    updateJournal(id: string, updateJournalDto: UpdateJournalDto): Promise<Journal>;
    removeJournal(id: string): Promise<void>;
    createIssue(createIssueDto: CreateIssueDto): Promise<Issue>;
    findAllIssues(journalId: string, paginationDto: PaginationDto): Promise<[Issue[], number]>;
    findIssueById(id: string): Promise<Issue>;
    updateIssue(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue>;
    removeIssue(id: string): Promise<void>;
}
