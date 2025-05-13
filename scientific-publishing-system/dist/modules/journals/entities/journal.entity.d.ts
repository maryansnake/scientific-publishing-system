import { User } from '../../users/entities/user.entity';
export declare enum JournalStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ARCHIVED = "archived"
}
export declare class Journal {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    issn: string;
    eissn: string;
    publisher: string;
    languages: string[];
    keywords: string[];
    aimsAndScope: string;
    status: JournalStatus;
    submissionGuidelines: string;
    peerReviewProcess: string;
    publicationFrequency: string;
    isOpenAccess: boolean;
    apcFee: number;
    contactInformation: any;
    editors: User[];
    createdAt: Date;
    updatedAt: Date;
}
