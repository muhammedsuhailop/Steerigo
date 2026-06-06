"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMessage = formatMessage;
function formatMessage(template, params) {
    let message = template;
    for (const key in params) {
        const regex = new RegExp(`{{${key}}}`, "g");
        message = message.replace(regex, params[key]);
    }
    return message;
}
//# sourceMappingURL=errorMessageFormatter.js.map