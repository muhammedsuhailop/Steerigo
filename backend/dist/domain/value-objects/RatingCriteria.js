"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingCriteria = void 0;
const RatingCriteriaType_1 = require("./RatingCriteriaType");
class RatingCriteria {
    constructor(criteria) {
        this.criteria = criteria;
    }
    static create(input) {
        const criteriaMap = new Map();
        for (const key of Object.values(RatingCriteriaType_1.RatingCriteriaType)) {
            const value = input[key] ?? 0;
            if (value < 0 || value > 5) {
                throw new Error(`${key} must be between 0 and 5`);
            }
            criteriaMap.set(key, value);
        }
        return new RatingCriteria(criteriaMap);
    }
    getValue() {
        return new Map(this.criteria);
    }
    toObject() {
        const obj = {};
        for (const [key, value] of this.criteria.entries()) {
            obj[key] = value;
        }
        return obj;
    }
    getAverage() {
        const values = Array.from(this.criteria.values());
        const sum = values.reduce((a, b) => a + b, 0);
        return parseFloat((sum / values.length).toFixed(2));
    }
}
exports.RatingCriteria = RatingCriteria;
//# sourceMappingURL=RatingCriteria.js.map