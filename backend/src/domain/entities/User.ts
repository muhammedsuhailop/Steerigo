import { AppConstants } from "@shared/constants/AppConstants";
import { DomainError } from "../errors/DomainError";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import {
  AuthProvider,
  UserRole,
  UserStatus,
} from "@shared/constants/AuthConstants";
import { BaseEntity } from "@shared/types/Repository";
import { Gender } from "@domain/value-objects/Gender";

export interface UserCreationProps {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  dob?: Date;
  gender?: Gender;
  address?: string;
  role?: UserRole;
}

export interface UserReconstructionProps extends UserCreationProps {
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  otpHash?: string;
  otpExpires?: Date;
  otpAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  googleId?: string;
  profilePicture?: string;
  authProvider?: AuthProvider;
}

export class User implements BaseEntity {
  private constructor(
    private readonly id: string,
    private name: string,
    private email: Email,
    private password: Password,
    private mobile?: string,
    private dob?: Date,
    private gender?: Gender,
    private address?: string,
    private role: UserRole = UserRole.RIDER,
    private status: UserStatus = UserStatus.PENDING_VERIFICATION,
    private isVerified: boolean = false,
    private otpHash?: string,
    private otpExpires?: Date,
    private otpAttempts: number = 0,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
    private googleId?: string,
    private profilePicture?: string,
    private authProvider: AuthProvider = AuthProvider.EMAIL
  ) {}

  static create(props: UserCreationProps): User {
    // Validate name
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError("Name must be at least 2 characters long");
    }

    if (props.name.trim().length > 100) {
      throw new DomainError("Name must be less than 100 characters");
    }

    // Create value objects
    const email = Email.create(props.email);
    const password = Password.createFromPlainText(props.password);

    return new User(
      props.id,
      props.name.trim(),
      email,
      password,
      props.mobile,
      props.dob,
      props.gender,
      props.address,
      props.role || UserRole.RIDER
    );
  }

  static reconstruct(props: UserReconstructionProps): User {
    const email = Email.create(props.email);
    const password = Password.createFromHash(props.password);

    return new User(
      props.id,
      props.name,
      email,
      password,
      props.mobile,
      props.dob,
      props.gender,
      props.address,
      props.role,
      props.status,
      props.isVerified,
      props.otpHash,
      props.otpExpires,
      props.otpAttempts,
      props.createdAt,
      props.updatedAt,
      props.googleId,
      props.profilePicture,
      props.authProvider || AuthProvider.EMAIL
    );
  }

  static createFromGoogle(props: {
    id: string;
    googleId: string;
    name: string;
    email: string;
    profilePicture?: string;
  }): User {
    const email = Email.create(props.email);
    const password = Password.createEmpty();

    return new User(
      props.id,
      props.name,
      email,
      password,
      undefined,
      undefined,
      undefined,
      undefined,
      UserRole.RIDER,
      UserStatus.ACTIVE, // Google users are pre-verified
      true,
      undefined,
      undefined,
      0,
      new Date(),
      new Date(),
      props.googleId,
      props.profilePicture,
      AuthProvider.GOOGLE
    );
  }

  // Business Logic Methods
  canLogin(): boolean {
    return this.isVerified && this.status === UserStatus.ACTIVE;
  }

  isAccountLocked(): boolean {
    return (
      this.status === UserStatus.BLOCKED || this.status === UserStatus.SUSPENDED
    );
  }

  isGoogleUser(): boolean {
    return this.authProvider === AuthProvider.GOOGLE;
  }

  canAttemptOtpVerification(): boolean {
    return this.otpAttempts < 3;
  }

  isOtpExpired(): boolean {
    if (!this.otpExpires) return true;
    return this.otpExpires.getTime() < Date.now();
  }

  // Domain Events (for future implementation)
  markEmailAsVerified(): void {
    if (this.isVerified) {
      throw new DomainError("User is already verified");
    }
    this.isVerified = true;
    this.status = UserStatus.ACTIVE;
    this.otpHash = undefined;
    this.otpExpires = undefined;
    this.otpAttempts = 0;
    this.updatedAt = new Date();
  }

  incrementOtpAttempts(): void {
    this.otpAttempts += 1;
    this.updatedAt = new Date();
  }

  resetOtpAttempts(): void {
    this.otpAttempts = 0;
    this.updatedAt = new Date();
  }

  updateProfile(updates: {
    name?: string;
    mobile?: string;
    dob?: Date;
    gender?: Gender;
    address?: string;
  }): void {
    if (updates.name) {
      if (updates.name.trim().length < 2) {
        throw new DomainError("Name must be at least 2 characters long");
      }
      this.name = updates.name.trim();
    }

    if (updates.mobile !== undefined) this.mobile = updates.mobile;
    if (updates.dob !== undefined) this.dob = updates.dob;
    if (updates.gender !== undefined) this.gender = updates.gender;
    if (updates.address !== undefined) this.address = updates.address;

    this.updatedAt = new Date();
  }

  updateProfilePicture(newPictureUrl: string): void {
    this.profilePicture = newPictureUrl;
    this.updatedAt = new Date();
  }

  setOtpDetails(otpHash: string, otpExpires: Date): void {
    this.otpHash = otpHash;
    this.otpExpires = otpExpires;
    this.otpAttempts = 0;
    this.updatedAt = new Date();
  }

  setResetOtpDetails(otpHash: string, expiresAt: Date): void {
    this.otpHash = otpHash;
    this.otpExpires = expiresAt;
    this.otpAttempts = 0;
  }

  getResetOtpHash(): string | undefined {
    return this.otpHash;
  }

  isResetOtpExpired(): boolean {
    if (!this.otpExpires) return true;
    return new Date() > this.otpExpires;
  }

  canAttemptResetOtp(): boolean {
    return this.otpAttempts < AppConstants.MAX_OTP_ATTEMPTS;
  }

  incrementResetOtpAttempts(): void {
    this.otpAttempts++;
  }

  updatePassword(newPasswordHash: Password): void {
    this.password = newPasswordHash;
    this.otpHash = undefined;
    this.otpExpires = undefined;
    this.otpAttempts = 0;
  }

  updateRole(newRole: string): void {
    this.role = newRole as UserRole;
    this.updatedAt = new Date();
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): Email {
    return this.email;
  }
  getEmailValue(): string {
    return this.email.getValue();
  }
  getPassword(): Password {
    return this.password;
  }
  getPasswordHash(): string {
    return this.password.getHashedValue();
  }
  getMobile(): string | undefined {
    return this.mobile;
  }
  getDob(): Date | undefined {
    return this.dob;
  }
  getGender(): Gender | undefined {
    return this.gender;
  }
  getAddress(): string | undefined {
    return this.address;
  }
  getRole(): UserRole {
    return this.role;
  }
  getStatus(): UserStatus {
    return this.status;
  }
  getIsVerified(): boolean {
    return this.isVerified;
  }
  getOtpHash(): string | undefined {
    return this.otpHash;
  }
  getOtpExpires(): Date | undefined {
    return this.otpExpires;
  }
  getOtpAttempts(): number {
    return this.otpAttempts;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }
  getGoogleId(): string | undefined {
    return this.googleId;
  }

  getProfilePicture(): string | undefined {
    return this.profilePicture;
  }

  getAuthProvider(): AuthProvider {
    return this.authProvider;
  }
}
