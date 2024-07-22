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
exports.DeleteUser = exports.UpdateUserRole = exports.getAllUseres = exports.updateUserAvatar = exports.UpdatePassword = exports.UpdateUserInfo = exports.updateAcesssToken = exports.SocialAuth = exports.userLogout = exports.userLogin = exports.getUserInfo = exports.ActivateRequest = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const ActivatinToken_1 = require("../utils/ActivatinToken");
const SendMail_1 = require("../utils/SendMail");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_services_1 = require("../Services/user.services");
const jwt_1 = require("../utils/jwt");
const Redis_1 = require("../utils/Redis");
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = __importDefault(require("fs"));
exports.registerUser = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("From the registerUser",req.body);
    const { FirstName, LastName, email, password, role } = req.body;
    if ([FirstName, LastName, email, password, role].some((field) => field === "")) {
        throw new ApiError_1.default(400, "All Fields Are Requried");
    }
    const userExist = yield user_model_1.default.findOne({ email });
    if (userExist) {
        throw new ApiError_1.default(400, "User Is Already Exists");
    }
    const { Token, ActivationCode } = (0, ActivatinToken_1.CreateActivationToken)(FirstName, LastName, email, password, role);
    const data = { user: { name: FirstName + LastName }, ActivationCode };
    yield (0, SendMail_1.sendMail)({
        type: "emailOptions",
        email: email,
        subject: "Activate Your Account",
        data,
    }).catch((e) => {
        throw new ApiError_1.default(400, "email is not connected");
    });
    res.send(new ApiResponse_1.ApiResponse(200, `Please check Your Email : ${email} to activate  your account `, Token));
}));
exports.ActivateRequest = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activation_code, accessToken } = req.body;
        const newUser = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACTIVATION_SECRET);
        // console.log("From the Activate Request",newUser.user);
        // console.log(activation_code,accessToken)
        const { LastName, FirstName, email, password, role } = newUser.user;
        const existuser = yield user_model_1.default.findOne({ email });
        if (existuser) {
            throw new ApiError_1.default(400, "user is already register to our Website");
        }
        if (newUser.ActivationCode !== activation_code) {
            throw new ApiError_1.default(400, "Invalid activation Code");
        }
        else {
            if (activation_code !== (null || undefined)) {
                const avatarUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${FirstName} ${LastName}`;
                const avatarResponse = yield fetch(avatarUrl);
                const avatarSvg = yield avatarResponse.text();
                // Upload avatar to Cloudinary
                const avatarUpload = yield cloudinary_1.default.v2.uploader.upload(`data:image/svg+xml;base64,${Buffer.from(avatarSvg).toString('base64')}`, {
                    folder: "avatars",
                    width: 150,
                });
                const createUser = yield user_model_1.default.create({
                    FirstName,
                    LastName,
                    email,
                    password,
                    role,
                    avatar: {
                        public_id: avatarUpload.public_id,
                        avatar_url: avatarUpload.secure_url,
                    },
                });
                res.send(new ApiResponse_1.ApiResponse(200, "User is succesfully created"));
            }
            else {
                throw new ApiError_1.default(400, "Token Is expired ");
            }
        }
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "invaild request for token validation");
    }
}));
exports.getUserInfo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        (0, user_services_1.getUserById)(userId, res);
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "User Info not Found");
    }
}));
exports.userLogin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //    console.log(email,password);
        if (!email || !password) {
            throw new ApiError_1.default(400, "Please Enter the email and password");
        }
        const user = yield user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            throw new ApiError_1.default(400, "User is not Exist");
        }
        //    console.log(user);
        const isPassword = yield user.isPasswordIsCorrect(password);
        ;
        if (!isPassword) {
            throw new ApiError_1.default(400, "User is not Match");
        }
        //    console.log(user,200,res);
        (0, jwt_1.SendTokenToRedis)(user, 200, res);
    }
    catch (error) {
        throw new ApiError_1.default(401, error);
    }
}));
exports.userLogout = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const domains = ['https://learn-alpha-murex.vercel.app',
            'https://learn-git-main-gana31s-projects.vercel.app',
            'https://learn-cw69512x3-gana31s-projects.vercel.app'];
        // console.log(req.user || "");
        const id = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || '';
        yield Redis_1.redis.del(id);
        domains.forEach(domain => {
            res.cookie("access_token", "", {
                maxAge: 1,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                domain: domain,
                path: '/'
            });
            res.cookie("refresh_token", "", {
                maxAge: 1,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                domain: domain,
                path: '/'
            });
        });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, "User LogOut Succesfully"));
    }
    catch (error) {
        next(new ApiError_1.default(401, error));
    }
}));
exports.SocialAuth = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, avatar } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            const newUser = yield user_model_1.default.create({ name, email, avatar });
            (0, jwt_1.SendTokenToRedis)(newUser, 200, res);
        }
        else {
            (0, jwt_1.SendTokenToRedis)(user, 200, res);
        }
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Trouble while using SocialAuth ");
    }
}));
exports.updateAcesssToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        console.log("Refresh TOken From the update", refresh_token);
        const decoded = (0, jsonwebtoken_1.verify)(refresh_token, process.env.REFRESH_TOKEN);
        // console.log(decoded);
        if (!decoded) {
            throw new ApiError_1.default(4002, "could not refresh Token");
        }
        const session = yield Redis_1.redis.get(decoded._id);
        if (!session) {
            throw new ApiError_1.default(400, "Please Login for access this resources");
        }
        const user = JSON.parse(session);
        const accessToken = (0, jsonwebtoken_1.sign)({ _id: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: '1d'
        });
        const refreshToken = (0, jsonwebtoken_1.sign)({ _id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: "5d"
        });
        req.user = user;
        res.cookie("access_token", accessToken, jwt_1.acccesTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        yield Redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800);
        res.status(200).json({ sucess: " True", accessToken, user });
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Trouble while using updateacessToken ");
    }
}));
exports.UpdateUserInfo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { FirstName, LastName, dateOfBirth, about, contactNumber, gender } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_model_1.default.findById(userId);
        if (FirstName && LastName && user && about && contactNumber && gender) {
            user.FirstName = FirstName;
            user.LastName = LastName;
            user.about = about;
            user.contactNumber = contactNumber;
            user.gender = gender;
            user.dateOfBirth = dateOfBirth;
        }
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield Redis_1.redis.set(userId, JSON.stringify(user));
        res.send(new ApiResponse_1.ApiResponse(200, "user is Updated Suucessfully", user));
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Error Accuring While Updating User Info ");
    }
}));
exports.UpdatePassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            throw new ApiError_1.default(400, "Please Enter the Old and New Password");
        }
        const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select("+password");
        if ((user === null || user === void 0 ? void 0 : user.password) === undefined) {
            throw new ApiError_1.default(400, "Invalid User ");
        }
        const isPasswordmatch = yield (user === null || user === void 0 ? void 0 : user.isPasswordIsCorrect(oldPassword));
        const isNewPassoword = yield (user === null || user === void 0 ? void 0 : user.isPasswordIsCorrect(newPassword));
        if (!isPasswordmatch) {
            throw new ApiError_1.default(400, "Invaild old Password");
        }
        if (isNewPassoword || (oldPassword === newPassword)) {
            throw new ApiError_1.default(400, "New Password should Not Be The same As privious One");
        }
        user.password = newPassword;
        yield user.save();
        yield Redis_1.redis.set((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, JSON.stringify(user));
        res.send(new ApiResponse_1.ApiResponse(200, "User Password Updated Successfully", user));
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Error Accuring While Updating User Password ");
    }
}));
exports.updateUserAvatar = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // console.log("From the updateUserAvatar",req.body);
        const filePath = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path;
        // console.log(filePath);
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const user = yield user_model_1.default.findById(userId);
        if (filePath && user) {
            if ((_c = user === null || user === void 0 ? void 0 : user.avatar) === null || _c === void 0 ? void 0 : _c.public_id) {
                yield cloudinary_1.default.v2.uploader.destroy((_d = user === null || user === void 0 ? void 0 : user.avatar) === null || _d === void 0 ? void 0 : _d.public_id);
                const myCloud = yield cloudinary_1.default.v2.uploader.upload(filePath, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    avatar_url: myCloud.secure_url,
                };
            }
            else {
                const myCloud = yield cloudinary_1.default.v2.uploader.upload(filePath, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    avatar_url: myCloud.secure_url,
                };
            }
            fs_1.default.unlinkSync(filePath);
        }
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield Redis_1.redis.set(userId, JSON.stringify(user));
        res.send(new ApiResponse_1.ApiResponse(200, "Avatar succesfully Updated", user));
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Error Accuring While Updating User Avatar ");
    }
}));
exports.getAllUseres = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, user_services_1.getAllUserServices)(res);
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Getting Error While GetAllUSer");
    }
}));
exports.UpdateUserRole = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, role } = req.body;
        (0, user_services_1.updateUserRoleService)(res, _id, role);
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Getting Error While Changing the User Role By Admin");
    }
}));
exports.DeleteUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const user = yield user_model_1.default.findById(_id);
        if (!user) {
            throw new ApiError_1.default(400, "User Is not Found FOr deleting");
        }
        yield user.deleteOne({ _id });
        yield Redis_1.redis.del(_id);
        res.send(new ApiResponse_1.ApiResponse(200, "User Deleted successfully"));
    }
    catch (error) {
        throw new ApiError_1.default(401, error instanceof Error ? error.message : "Getting Error While Deleting the User By Admin");
    }
}));
//# sourceMappingURL=user.controller.js.map