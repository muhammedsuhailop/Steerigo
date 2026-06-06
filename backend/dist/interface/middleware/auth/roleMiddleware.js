"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = requireRoles;
function requireRoles(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            const response = {
                success: false,
                message: "Not authenticated",
            };
            res.status(401).json(response);
            return;
        }
        if (!allowedRoles.includes(user.role)) {
            const response = {
                success: false,
                message: "Access Restricted",
            };
            res.status(403).json(response);
            return;
        }
        next();
    };
}
//# sourceMappingURL=roleMiddleware.js.map