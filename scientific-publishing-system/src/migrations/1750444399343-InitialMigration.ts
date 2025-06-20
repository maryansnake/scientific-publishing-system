import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1750444399343 implements MigrationInterface {
    name = 'InitialMigration1750444399343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('admin', 'editor', 'reviewer', 'author', 'reader')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "roles" "public"."users_roles_enum" array NOT NULL DEFAULT '{reader}', "institution" character varying, "orcidId" character varying, "academicDegree" character varying, "bio" character varying(1000), "profilePicture" character varying, "isEmailVerified" boolean NOT NULL DEFAULT false, "emailVerificationToken" character varying, "passwordResetToken" character varying, "passwordResetExpires" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."journals_status_enum" AS ENUM('active', 'inactive', 'archived')`);
        await queryRunner.query(`CREATE TABLE "journals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text, "coverImage" character varying, "issn" character varying, "eissn" character varying, "publisher" character varying, "languages" text, "keywords" text, "aimsAndScope" text, "status" "public"."journals_status_enum" NOT NULL DEFAULT 'active', "submissionGuidelines" text, "peerReviewProcess" text, "publicationFrequency" character varying, "isOpenAccess" boolean NOT NULL DEFAULT false, "apcFee" integer, "contactInformation" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8061c797e09cde9f8d51113f9d0" UNIQUE ("slug"), CONSTRAINT "PK_157a30136385dd81cdd19111380" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."issues_status_enum" AS ENUM('draft', 'scheduled', 'published', 'archived')`);
        await queryRunner.query(`CREATE TABLE "issues" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "coverImage" character varying, "volume" integer NOT NULL, "number" integer NOT NULL, "publicationDate" date, "status" "public"."issues_status_enum" NOT NULL DEFAULT 'draft', "doi" character varying, "journalId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "journal_id" uuid, CONSTRAINT "PK_9d8ecbbeff46229c700f0449257" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."articles_type_enum" AS ENUM('research', 'review', 'case_study', 'opinion', 'short_communication', 'technical_note', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."articles_status_enum" AS ENUM('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'revisions_needed', 'published', 'withdrawn')`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "abstract" text NOT NULL, "keywords" text, "type" "public"."articles_type_enum" NOT NULL DEFAULT 'research', "status" "public"."articles_status_enum" NOT NULL DEFAULT 'draft', "doi" character varying, "pages" character varying, "submissionDate" TIMESTAMP, "acceptanceDate" TIMESTAMP, "publicationDate" TIMESTAMP, "mainFileUrl" character varying, "metadata" json, "submitterId" character varying NOT NULL, "journalId" character varying NOT NULL, "issueId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "submitter_id" uuid, "journal_id" uuid, "issue_id" uuid, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reviews_status_enum" AS ENUM('pending', 'completed', 'declined', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."reviews_recommendation_enum" AS ENUM('accept', 'minor_revisions', 'major_revisions', 'reject')`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "articleId" character varying NOT NULL, "reviewerId" character varying NOT NULL, "assignedById" character varying NOT NULL, "status" "public"."reviews_status_enum" NOT NULL DEFAULT 'pending', "recommendation" "public"."reviews_recommendation_enum", "commentsToAuthor" text, "commentsToEditor" text, "fileUrl" character varying, "qualityScore" integer, "originalityScore" integer, "relevanceScore" integer, "clarityScore" integer, "anonymous" boolean NOT NULL DEFAULT false, "dueDate" TIMESTAMP NOT NULL, "completionDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "article_id" uuid, "reviewer_id" uuid, "assigned_by_id" uuid, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('submission', 'review_assignment', 'review_completed', 'article_status_change', 'issue_published', 'account', 'system')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "title" character varying(255) NOT NULL, "message" text NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "linkUrl" character varying, "metadata" json, "isRead" boolean NOT NULL DEFAULT false, "isEmailed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."article_files_filetype_enum" AS ENUM('manuscript', 'supplementary', 'figure', 'table', 'dataset', 'revised_version', 'proof', 'final_version', 'other')`);
        await queryRunner.query(`CREATE TABLE "article_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying(255) NOT NULL, "fileUrl" character varying NOT NULL, "fileSize" integer NOT NULL, "mimeType" character varying(100) NOT NULL, "fileType" "public"."article_files_filetype_enum" NOT NULL, "description" character varying, "version" integer NOT NULL DEFAULT '1', "articleId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "article_id" uuid, CONSTRAINT "PK_f4e12845c7bf97fe17238375210" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "journal_editors" ("journal_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_0567c5ccfafbca6c6f5c2f6aaab" PRIMARY KEY ("journal_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_478bf3fb8075c58ca518ace93b" ON "journal_editors" ("journal_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1e9576ca9ebc768f2b110ea42a" ON "journal_editors" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "article_authors" ("article_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_9875ebd4bbb0a7bdc21754b7865" PRIMARY KEY ("article_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a045495388d3a462887cc91cfc" ON "article_authors" ("article_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0726609aa7b8a9cd7d53e131d9" ON "article_authors" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_8bb8d2611dabc7efb1a0505d7c1" FOREIGN KEY ("journal_id") REFERENCES "journals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_875485288903404e4c38aceb30a" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_1e66cee704f541bb388c5439082" FOREIGN KEY ("journal_id") REFERENCES "journals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_da07782815f05eec48e2cf6c026" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_19cc2abbefe70f6e2bbdd85229d" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_92e950a2513a79bb3fab273c92e" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_8ae2eb763fafe2b4d647f9ab211" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_files" ADD CONSTRAINT "FK_c1c110a4cc08441c443fda9779c" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "journal_editors" ADD CONSTRAINT "FK_478bf3fb8075c58ca518ace93b0" FOREIGN KEY ("journal_id") REFERENCES "journals"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "journal_editors" ADD CONSTRAINT "FK_1e9576ca9ebc768f2b110ea42a9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_authors" ADD CONSTRAINT "FK_a045495388d3a462887cc91cfca" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_authors" ADD CONSTRAINT "FK_0726609aa7b8a9cd7d53e131d9b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_authors" DROP CONSTRAINT "FK_0726609aa7b8a9cd7d53e131d9b"`);
        await queryRunner.query(`ALTER TABLE "article_authors" DROP CONSTRAINT "FK_a045495388d3a462887cc91cfca"`);
        await queryRunner.query(`ALTER TABLE "journal_editors" DROP CONSTRAINT "FK_1e9576ca9ebc768f2b110ea42a9"`);
        await queryRunner.query(`ALTER TABLE "journal_editors" DROP CONSTRAINT "FK_478bf3fb8075c58ca518ace93b0"`);
        await queryRunner.query(`ALTER TABLE "article_files" DROP CONSTRAINT "FK_c1c110a4cc08441c443fda9779c"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_8ae2eb763fafe2b4d647f9ab211"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_92e950a2513a79bb3fab273c92e"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_19cc2abbefe70f6e2bbdd85229d"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_da07782815f05eec48e2cf6c026"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_1e66cee704f541bb388c5439082"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_875485288903404e4c38aceb30a"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_8bb8d2611dabc7efb1a0505d7c1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0726609aa7b8a9cd7d53e131d9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a045495388d3a462887cc91cfc"`);
        await queryRunner.query(`DROP TABLE "article_authors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1e9576ca9ebc768f2b110ea42a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_478bf3fb8075c58ca518ace93b"`);
        await queryRunner.query(`DROP TABLE "journal_editors"`);
        await queryRunner.query(`DROP TABLE "article_files"`);
        await queryRunner.query(`DROP TYPE "public"."article_files_filetype_enum"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TYPE "public"."reviews_recommendation_enum"`);
        await queryRunner.query(`DROP TYPE "public"."reviews_status_enum"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TYPE "public"."articles_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."articles_type_enum"`);
        await queryRunner.query(`DROP TABLE "issues"`);
        await queryRunner.query(`DROP TYPE "public"."issues_status_enum"`);
        await queryRunner.query(`DROP TABLE "journals"`);
        await queryRunner.query(`DROP TYPE "public"."journals_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    }

}
