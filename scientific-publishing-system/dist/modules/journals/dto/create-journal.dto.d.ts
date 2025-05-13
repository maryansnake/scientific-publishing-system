import { JournalStatus } from '../entities/journal.entity';
export declare class ContactInformationDto {
    email: string;
    phone?: string;
    address?: string;
}
export declare class CreateJournalDto {
    title: string;
    slug: string;
    description?: string;
    coverImage?: string;
    issn?: string;
    eissn?: string;
    publisher?: string;
    languages?: string[];
    keywords?: string[];
    aimsAndScope?: string;
    status?: JournalStatus;
    submissionGuidelines?: string;
    peerReviewProcess?: string;
    publicationFrequency?: string;
    isOpenAccess?: boolean;
    apcFee?: number;
    contactInformation?: ContactInformationDto;
    editorIds?: string[];
}
