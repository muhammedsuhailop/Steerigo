"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponUsageRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const CouponUsageModel_1 = require("../models/CouponUsageModel");
const CouponUsageMapper_1 = require("../mappers/CouponUsageMapper");
let CouponUsageRepositoryImpl = class CouponUsageRepositoryImpl {
    async countByUserAndCoupon(userId, couponId) {
        return await CouponUsageModel_1.CouponUsageModel.countDocuments({
            userId,
            couponId,
        });
    }
    async create(usage) {
        const data = CouponUsageMapper_1.CouponUsageMapper.toPersistence(usage);
        await CouponUsageModel_1.CouponUsageModel.create(data);
    }
};
exports.CouponUsageRepositoryImpl = CouponUsageRepositoryImpl;
exports.CouponUsageRepositoryImpl = CouponUsageRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], CouponUsageRepositoryImpl);
//# sourceMappingURL=CouponUsageRepositoryImpl.js.map