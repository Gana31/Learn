"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (reqestHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqestHandler(req, res, next)).catch((e) => next(e));
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map