"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBody = void 0;
//Middleware to check if request body exists and optionally validate required fields.
const checkBody = (req, res, next) => {
    console.log("req headers", req.headers);
    console.log(`[${req.method}] ${req.originalUrl} body:`, req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
        const response = {
            success: false,
            message: "Request body is missing",
        };
        res.status(400).json(response);
        return;
    }
    next();
};
exports.checkBody = checkBody;
//# sourceMappingURL=CheckBodyMiddleware.js.map