"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const ApiError_1 = __importDefault(require("./ApiError"));
require("dotenv").config();
const RedisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("Redis is Connected");
        return process.env.REDIS_URL;
    }
    throw new ApiError_1.default(400, "Redis Is Not Conected");
};
exports.redis = new ioredis_1.Redis(RedisClient());
//# sourceMappingURL=Redis.js.map