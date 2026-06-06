"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUnitOfWork = void 0;
const mongoose_1 = require("mongoose");
const inversify_1 = require("inversify");
let MongoUnitOfWork = class MongoUnitOfWork {
    async runInTransaction(work) {
        const session = await mongoose_1.connection.startSession();
        try {
            session.startTransaction();
            const result = await work();
            await session.commitTransaction();
            return result;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
};
exports.MongoUnitOfWork = MongoUnitOfWork;
exports.MongoUnitOfWork = MongoUnitOfWork = __decorate([
    (0, inversify_1.injectable)()
], MongoUnitOfWork);
//# sourceMappingURL=MongoUnitOfWork.js.map