"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        message: err.message,
        success: err.success,
    });
};
exports.default = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map