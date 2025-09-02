import { DomainError } from "../errors/DomainError";

export class User {
    private constructor(
        private readonly id: string,
        private name: string,
        private email: string,
        private password: string,
        private mobile?: string,
        private dob?: Date,
        private gender?: string,
        private address?: string,
        private role: string = "Rider",
        private status: string = "Pending Verification",
        private isVerified: boolean = false,
        private otpHash?: string,
        private otpExpires?: Date,
        private otpAttempts: number = 0,
        private createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) { }

    static create(props: {
        id: string;
        name: string;
        email: string;
        password: string;
        mobile?: string;
        dob?: Date;
        gender?: string;
        address?: string;
        role?: string;
    }): User {
        // Business rule validations
        if (!props.name || props.name.trim().length < 2) {
            throw new DomainError("Name must be at least 2 characters long");
        }

        if (!User.isValidEmail(props.email)) {
            throw new DomainError("Invalid email format");
        }

        return new User(
            props.id,
            props.name.trim(),
            props.email.toLowerCase().trim(),
            props.password,
            props.mobile,
            props.dob,
            props.gender,
            props.address,
            props.role || "Rider"
        );
    }

    static reconstruct(props: {
        id: string;
        name: string;
        email: string;
        password: string;
        mobile?: string;
        dob?: Date;
        gender?: string;
        address?: string;
        role: string;
        status: string;
        isVerified: boolean;
        otpHash?: string;
        otpExpires?: Date;
        otpAttempts: number;
        createdAt: Date;
        updatedAt: Date;
    }): User {
        return new User(
            props.id,
            props.name,
            props.email,
            props.password,
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
            props.updatedAt
        );
    }

    // Business methods
    setOtpDetails(otpHash: string, otpExpires: Date): void {
        this.otpHash = otpHash;
        this.otpExpires = otpExpires;
        this.otpAttempts = 0;
        this.updatedAt = new Date();
    }

    canAttemptOtpVerification(): boolean {
        return this.otpAttempts < 3;
    }

    isOtpExpired(): boolean {
        if (!this.otpExpires) return true;
        return this.otpExpires.getTime() < Date.now();
    }

    incrementOtpAttempts(): void {
        this.otpAttempts += 1;
        this.updatedAt = new Date();
    }

    verify(): void {
        if (this.isVerified) {
            throw new DomainError("User is already verified");
        }

        this.isVerified = true;
        this.status = "Active";
        this.otpHash = undefined;
        this.otpExpires = undefined;
        this.otpAttempts = 0;
        this.updatedAt = new Date();
    }

    updateProfile(props: {
        name?: string;
        mobile?: string;
        dob?: Date;
        gender?: string;
        address?: string;
    }): void {
        if (props.name) {
            if (props.name.trim().length < 2) {
                throw new DomainError("Name must be at least 2 characters long");
            }
            this.name = props.name.trim();
        }

        if (props.mobile !== undefined) this.mobile = props.mobile;
        if (props.dob !== undefined) this.dob = props.dob;
        if (props.gender !== undefined) this.gender = props.gender;
        if (props.address !== undefined) this.address = props.address;

        this.updatedAt = new Date();
    }

    updatePassword(newPassword: string): void {
        if (!newPassword || newPassword.trim().length === 0) {
            throw new DomainError('Password cannot be empty');
        }

        this.password = newPassword;
        this.updatedAt = new Date()
    }

    // Validation helpers
    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Getters
    getId(): string {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getEmail(): string {
        return this.email;
    }
    getPassword(): string {
        return this.password;
    }
    getMobile(): string | undefined {
        return this.mobile;
    }
    getDob(): Date | undefined {
        return this.dob;
    }
    getGender(): string | undefined {
        return this.gender;
    }
    getAddress(): string | undefined {
        return this.address;
    }
    getRole(): string {
        return this.role;
    }
    getStatus(): string {
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
}
