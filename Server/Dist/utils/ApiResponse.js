"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, message = "Success", data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map