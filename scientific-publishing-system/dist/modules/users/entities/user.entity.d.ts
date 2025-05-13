export declare enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    REVIEWER = "reviewer",
    AUTHOR = "author",
    READER = "reader"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: UserRole[];
    institution: string;
    orcidId: string;
    academicDegree: string;
    bio: string;
    profilePicture: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
