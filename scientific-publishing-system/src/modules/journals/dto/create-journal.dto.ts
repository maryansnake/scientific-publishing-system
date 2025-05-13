import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { JournalStatus } from '../entities/journal.entity';

export class ContactInformationDto {
  @ApiProperty({ description: 'Email for journal contact' })
  @IsString()
  email: string;

  @ApiPropertyOptional({ description: 'Phone number for journal contact' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Address for journal contact' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateJournalDto {
  @ApiProperty({ description: 'Title of the journal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'URL slug for the journal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({ description: 'Description of the journal' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Print ISSN of the journal' })
  @IsOptional()
  @IsString()
  issn?: string;

  @ApiPropertyOptional({ description: 'Electronic ISSN of the journal' })
  @IsOptional()
  @IsString()
  eissn?: string;

  @ApiPropertyOptional({ description: 'Publisher name' })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({ description: 'Languages supported by the journal', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ description: 'Keywords related to the journal', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Aims and scope of the journal' })
  @IsOptional()
  @IsString()
  aimsAndScope?: string;

  @ApiPropertyOptional({ description: 'Status of the journal', enum: JournalStatus })
  @IsOptional()
  @IsEnum(JournalStatus)
  status?: JournalStatus;

  @ApiPropertyOptional({ description: 'Submission guidelines for authors' })
  @IsOptional()
  @IsString()
  submissionGuidelines?: string;

  @ApiPropertyOptional({ description: 'Description of peer review process' })
  @IsOptional()
  @IsString()
  peerReviewProcess?: string;

  @ApiPropertyOptional({ description: 'Publication frequency (e.g., Quarterly)' })
  @IsOptional()
  @IsString()
  publicationFrequency?: string;

  @ApiPropertyOptional({ description: 'Is this an open access journal' })
  @IsOptional()
  @IsBoolean()
  isOpenAccess?: boolean;

  @ApiPropertyOptional({ description: 'Article processing charge fee amount' })
  @IsOptional()
  @IsNumber()
  apcFee?: number;

  @ApiPropertyOptional({ description: 'Contact information for the journal' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInformationDto)
  contactInformation?: ContactInformationDto;

  @ApiPropertyOptional({ description: 'IDs of editors for this journal', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  editorIds?: string[];
}