"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAutheticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const asyncHandler_1 = require("../utils/asyncHandler");
const Redis_1 = require("../utils/Redis");
exports.isAutheticated = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies["access_token"];
    // console.log(req.cookies)
    // console.log("accesss TOken ++++++++++++=",access_token)
    if (!access_token) {
        const refresh_token = req.cookies["refresh_token"];
        if (!refresh_token) {
            throw new ApiError_1.default(401, "User is not Login In Our website");
        }
        return next(new ApiError_1.default(401, "Please refresh token"));
    }
    const decoded = yield jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
        throw new ApiError_1.default(401, "access token is not vaild ");
    }
    const user = yield Redis_1.redis.get(decoded._id);
    // console.log(user);
    if (!user) {
        throw new ApiError_1.default(400, "Please Login To website");
    }
    req.user = JSON.parse(user);
    // console.log(req.user);
    next();
}));
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || '')) {
            throw new ApiError_1.default(400, `Role ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this resources`);
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=Auth.middleware.js.map