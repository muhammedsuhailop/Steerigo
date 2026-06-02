"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const AppConstants_1 = require("../../shared/constants/AppConstants");
const DomainError_1 = require("../errors/DomainError");
const Email_1 = require("../value-objects/Email");
const Password_1 = require("../value-objects/Password");
const AuthConstants_1 = require("../../shared/constants/AuthConstants");
class User {
    constructor(id, name, email, password, mobile, dob, gender, address, role = AuthConstants_1.UserRole.RIDER, status = AuthConstants_1.UserStatus.PENDING_VERIFICATION, isVerified = false, otpHash, otpExpires, otpAttempts = 0, createdAt = new Date(), updatedAt = new Date(), googleId, profilePicture, authProvider = AuthConstants_1.AuthProvider.EMAIL) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.role = role;
        this.status = status;
        this.isVerified = isVerified;
        this.otpHash = otpHash;
        this.otpExpires = otpExpires;
        this.otpAttempts = otpAttempts;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.googleId = googleId;
        this.profilePicture = profilePicture;
        this.authProvider = authProvider;
    }
    static create(props) {
        // Validate name
        if (!props.name || props.name.trim().length < 2) {
            throw new DomainError_1.DomainError("Name must be at least 2 characters long");
        }
        if (props.name.trim().length > 100) {
            throw new DomainError_1.DomainError("Name must be less than 100 characters");
        }
        // Create value objects
        const email = Email_1.Email.create(props.email);
        const password = Password_1.Password.createFromPlainText(props.password);
        return new User(props.id, props.name.trim(), email, password, props.mobile, props.dob, props.gender, props.address, props.role || AuthConstants_1.UserRole.RIDER);
    }
    static reconstruct(props) {
        const email = Email_1.Email.create(props.email);
        const password = Password_1.Password.createFromHash(props.password);
        return new User(props.id, props.name, email, password, props.mobile, props.dob, props.gender, props.address, props.role, props.status, props.isVerified, props.otpHash, props.otpExpires, props.otpAttempts, props.createdAt, props.updatedAt, props.googleId, props.profilePicture, props.authProvider || AuthConstants_1.AuthProvider.EMAIL);
    }
    static createFromGoogle(props) {
        const email = Email_1.Email.create(props.email);
        const password = Password_1.Password.createEmpty();
        return new User(props.id, props.name, email, password, undefined, undefined, undefined, undefined, AuthConstants_1.UserRole.RIDER, AuthConstants_1.UserStatus.ACTIVE, // Google users are pre-verified
        true, undefined, undefined, 0, new Date(), new Date(), props.googleId, props.profilePicture, AuthConstants_1.AuthProvider.GOOGLE);
    }
    // Business Logic Methods
    canLogin() {
        return this.isVerified && this.status === AuthConstants_1.UserStatus.ACTIVE;
    }
    isAccountLocked() {
        return (this.status === AuthConstants_1.UserStatus.BLOCKED || this.status === AuthConstants_1.UserStatus.SUSPENDED);
    }
    isGoogleUser() {
        return this.authProvider === AuthConstants_1.AuthProvider.GOOGLE;
    }
    canAttemptOtpVerification() {
        return this.otpAttempts < 3;
    }
    isOtpExpired() {
        if (!this.otpExpires)
            return true;
        return this.otpExpires.getTime() < Date.now();
    }
    // Domain Events (for future implementation)
    markEmailAsVerified() {
        if (this.isVerified) {
            throw new DomainError_1.DomainError("User is already verified");
        }
        this.isVerified = true;
        this.status = AuthConstants_1.UserStatus.ACTIVE;
        this.otpHash = undefined;
        this.otpExpires = undefined;
        this.otpAttempts = 0;
        this.updatedAt = new Date();
    }
    incrementOtpAttempts() {
        this.otpAttempts += 1;
        this.updatedAt = new Date();
    }
    resetOtpAttempts() {
        this.otpAttempts = 0;
        this.updatedAt = new Date();
    }
    updateProfile(updates) {
        if (updates.name) {
            if (updates.name.trim().length < 2) {
                throw new DomainError_1.DomainError("Name must be at least 2 characters long");
            }
            this.name = updates.name.trim();
        }
        if (updates.mobile !== undefined)
            this.mobile = updates.mobile;
        if (updates.dob !== undefined)
            this.dob = updates.dob;
        if (updates.gender !== undefined)
            this.gender = updates.gender;
        if (updates.address !== undefined)
            this.address = updates.address;
        this.updatedAt = new Date();
    }
    updateProfilePicture(newPictureUrl) {
        this.profilePicture = newPictureUrl;
        this.updatedAt = new Date();
    }
    setOtpDetails(otpHash, otpExpires) {
        this.otpHash = otpHash;
        this.otpExpires = otpExpires;
        this.otpAttempts = 0;
        this.updatedAt = new Date();
    }
    setResetOtpDetails(otpHash, expiresAt) {
        this.otpHash = otpHash;
        this.otpExpires = expiresAt;
        this.otpAttempts = 0;
    }
    getResetOtpHash() {
        return this.otpHash;
    }
    isResetOtpExpired() {
        if (!this.otpExpires)
            return true;
        return new Date() > this.otpExpires;
    }
    canAttemptResetOtp() {
        return this.otpAttempts < AppConstants_1.AppConstants.MAX_OTP_ATTEMPTS;
    }
    incrementResetOtpAttempts() {
        this.otpAttempts++;
    }
    updatePassword(newPasswordHash) {
        this.password = newPasswordHash;
        this.otpHash = undefined;
        this.otpExpires = undefined;
        this.otpAttempts = 0;
    }
    updateRole(newRole) {
        this.role = newRole;
        this.updatedAt = new Date();
    }
    // Getters
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
    getEmailValue() {
        return this.email.getValue();
    }
    getPassword() {
        return this.password;
    }
    getPasswordHash() {
        return this.password.getHashedValue();
    }
    getMobile() {
        return this.mobile;
    }
    getDob() {
        return this.dob;
    }
    getGender() {
        return this.gender;
    }
    getAddress() {
        return this.address;
    }
    getRole() {
        return this.role;
    }
    getStatus() {
        return this.status;
    }
    getIsVerified() {
        return this.isVerified;
    }
    getOtpHash() {
        return this.otpHash;
    }
    getOtpExpires() {
        return this.otpExpires;
    }
    getOtpAttempts() {
        return this.otpAttempts;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    getGoogleId() {
        return this.googleId;
    }
    getProfilePicture() {
        return this.profilePicture;
    }
    getAuthProvider() {
        return this.authProvider;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map