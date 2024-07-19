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
exports.updateUserRoleService = exports.getAllUserServices = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiResponse_1 = require("../utils/ApiResponse");
const Redis_1 = require("../utils/Redis");
const getUserById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userjson = yield Redis_1.redis.get(id);
    if (userjson) {
        const user = JSON.parse(userjson);
        res.send(new ApiResponse_1.ApiResponse(200, 'GETTING a User By Id', user));
    }
});
exports.getUserById = getUserById;
const getAllUserServices = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().sort({ createdAt: -1 });
    res.send(new ApiResponse_1.ApiResponse(200, "all User Fetched Successfully", users));
});
exports.getAllUserServices = getAllUserServices;
const updateUserRoleService = (res, _id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndUpdate(_id, { role }, { new: true });
    res.send(new ApiResponse_1.ApiResponse(200, "User Role Upadate Succesfully Bu admin", user));
});
exports.updateUserRoleService = updateUserRoleService;
//# sourceMappingURL=user.services.js.map