"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const inversify_1 = require("inversify");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const Logger_1 = require("@shared/utils/Logger");
let RazorpayService = class RazorpayService {
    constructor() {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
            throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment");
        }
        this.client = new razorpay_1.default({ key_id: keyId, key_secret: keySecret });
        this.keySecret = keySecret;
    }
    async createOrder(params) {
        try {
            const amountInPaise = Math.round(params.amount * 100);
            const sanitizedReceipt = `pay_${crypto_1.default
                .randomUUID()
                .replace(/-/g, "")
                .slice(0, 30)}`;
            const order = await this.client.orders.create({
                amount: amountInPaise,
                currency: params.currency,
                receipt: sanitizedReceipt,
                notes: params.notes,
            });
            Logger_1.Logger.info("Razorpay order created", {
                orderId: order.id,
                amount: amountInPaise,
                currency: params.currency,
            });
            return {
                gatewayOrderId: order.id,
                amount: params.amount,
                currency: params.currency,
                receipt: params.receipt,
            };
        }
        catch (error) {
            Logger_1.Logger.error("Failed to create Razorpay order", {
                error: JSON.stringify(error, null, 2),
            });
            throw error;
        }
    }
    verifySignature(params) {
        const body = `${params.gatewayOrderId}|${params.gatewayPaymentId}`;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", this.keySecret)
            .update(body)
            .digest("hex");
        const isValid = expectedSignature === params.gatewaySignature;
        Logger_1.Logger.debug("Razorpay signature verification", {
            gatewayOrderId: params.gatewayOrderId,
            isValid,
        });
        return isValid;
    }
};
exports.RazorpayService = RazorpayService;
exports.RazorpayService = RazorpayService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], RazorpayService);
//# sourceMappingURL=RazorpayService.js.map