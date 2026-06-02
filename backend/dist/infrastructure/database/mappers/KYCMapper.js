"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCMapper = void 0;
const KYC_1 = require("../../../domain/entities/KYC");
const mongoose_1 = require("mongoose");
class KYCMapper {
    static toDomain(raw) {
        return KYC_1.KYC.fromData({
            id: raw._id.toString(),
            driverId: raw.driverId.toString(),
            docType: raw.docType,
            docNumber: raw.docNumber,
            issueDate: raw.issueDate,
            expiryDate: raw.expiryDate,
            verificationStatus: raw.verificationStatus,
            comments: raw.comments,
            docImageUrlsFront: raw.docImageUrlsFront,
            docImageUrlsBack: raw.docImageUrlsBack,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    static toPersistence(kyc) {
        return {
            _id: new mongoose_1.Types.ObjectId(kyc.getId()),
            driverId: new mongoose_1.Types.ObjectId(kyc.getDriverId()),
            docType: kyc.getDocType(),
            docNumber: kyc.getDocNumber(),
            issueDate: kyc.getIssueDate(),
            expiryDate: kyc.getExpiryDate(),
            verificationStatus: kyc.getVerificationStatus(),
            comments: kyc.getComments(),
            docImageUrlsFront: kyc.getDocImageUrlsFront(),
            docImageUrlsBack: kyc.getDocImageUrlsBack(),
            updatedAt: kyc.getUpdatedAt(),
        };
    }
}
exports.KYCMapper = KYCMapper;
//# sourceMappingURL=KYCMapper.js.map