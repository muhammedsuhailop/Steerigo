"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYC = void 0;
const KYCStatus_1 = require("../value-objects/KYCStatus");
class KYC {
    constructor(id, driverId, docType, docNumber, verificationStatus, issueDate, expiryDate, comments, docImageUrlsFront = [], docImageUrlsBack = [], createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.driverId = driverId;
        this.docType = docType;
        this.docNumber = docNumber;
        this.verificationStatus = verificationStatus;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.comments = comments;
        this.docImageUrlsFront = docImageUrlsFront;
        this.docImageUrlsBack = docImageUrlsBack;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    // Factory method for creating new KYC documents
    static create(id, driverId, docType, docNumber, issueDate, expiryDate, frontUrls = [], backUrls = []) {
        return new KYC(id, driverId, docType, docNumber, KYCStatus_1.KYCStatus.IN_REVIEW, issueDate, expiryDate, undefined, frontUrls, backUrls);
    }
    // Factory method for reconstructing from database
    static fromData(data) {
        return new KYC(data.id, data.driverId, data.docType, data.docNumber, data.verificationStatus, data.issueDate, data.expiryDate, data.comments, data.docImageUrlsFront, data.docImageUrlsBack, data.createdAt, data.updatedAt);
    }
    // Getters
    getId() {
        return this.id;
    }
    getDriverId() {
        return this.driverId;
    }
    getDocType() {
        return this.docType;
    }
    getDocNumber() {
        return this.docNumber;
    }
    getIssueDate() {
        return this.issueDate;
    }
    getExpiryDate() {
        return this.expiryDate;
    }
    getVerificationStatus() {
        return this.verificationStatus;
    }
    getComments() {
        return this.comments;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    getDocImageUrlsFront() {
        return [...this.docImageUrlsFront];
    }
    getDocImageUrlsBack() {
        return [...this.docImageUrlsBack];
    }
    getDocumentType() {
        return this.docType;
    }
    getDocumentNumber() {
        return this.docNumber;
    }
    // Business methods
    approve(comments) {
        if (this.verificationStatus === KYCStatus_1.KYCStatus.APPROVED) {
            throw new Error("KYC is already approved");
        }
        this.verificationStatus = KYCStatus_1.KYCStatus.APPROVED;
        this.comments = comments;
        this.updatedAt = new Date();
    }
    reject(comments) {
        if (!comments || comments.trim() === "") {
            throw new Error("Comments are required for rejecting KYC");
        }
        this.verificationStatus = KYCStatus_1.KYCStatus.REJECTED;
        this.comments = comments;
        this.updatedAt = new Date();
    }
    markExpired(comments) {
        this.verificationStatus = KYCStatus_1.KYCStatus.EXPIRED;
        this.comments = comments;
        this.updatedAt = new Date();
    }
    updateDocument(docType, docNumber, issueDate, expiryDate) {
        this.docType = docType;
        this.docNumber = docNumber;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.verificationStatus = KYCStatus_1.KYCStatus.IN_REVIEW;
        this.updatedAt = new Date();
    }
    updateDocumentImages(frontUrls, backUrls) {
        this.docImageUrlsFront = [...frontUrls];
        this.docImageUrlsBack = [...backUrls];
        this.updatedAt = new Date();
    }
    isExpired() {
        if (!this.expiryDate)
            return false;
        return this.expiryDate < new Date();
    }
    isApproved() {
        return this.verificationStatus === KYCStatus_1.KYCStatus.APPROVED;
    }
    isRejected() {
        return this.verificationStatus === KYCStatus_1.KYCStatus.REJECTED;
    }
}
exports.KYC = KYC;
//# sourceMappingURL=KYC.js.map