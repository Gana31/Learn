"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.success = false;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map