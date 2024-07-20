"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_middleware_1 = require("../middleware/Auth.middleware");
const multer_1 = require("../middleware/multer");
const TeacherCourse_controller_1 = require("../controllers/TeacherCourse.controller");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.post('/registerUser', user_controller_1.registerUser);
userRouter.post('/activateUser', user_controller_1.ActivateRequest);
userRouter.post('/loginUser', user_controller_1.userLogin);
userRouter.get('/logoutUser', Auth_middleware_1.isAutheticated, user_controller_1.userLogout);
userRouter.get('/refreshToken', user_controller_1.updateAcesssToken);
userRouter.get('/UserInfo', Auth_middleware_1.isAutheticated, user_controller_1.getUserInfo);
userRouter.get('/EnrolledCourses', Auth_middleware_1.isAutheticated, TeacherCourse_controller_1.getEnrolledCourses);
userRouter.post('/SocialAuth', user_controller_1.SocialAuth);
userRouter.put('/updateUser', Auth_middleware_1.isAutheticated, user_controller_1.UpdateUserInfo);
userRouter.put('/updateUserPassword', Auth_middleware_1.isAutheticated, user_controller_1.UpdatePassword);
userRouter.put('/UpadateUserAvatar', Auth_middleware_1.isAutheticated, multer_1.upload.single('avatar'), user_controller_1.updateUserAvatar);
userRouter.get('/GetAllUSerAdmin', Auth_middleware_1.isAutheticated, (0, Auth_middleware_1.authorizeRoles)("admin"), user_controller_1.getAllUseres);
userRouter.put('/UpdateUserRoleByAdmin', Auth_middleware_1.isAutheticated, (0, Auth_middleware_1.authorizeRoles)("admin"), user_controller_1.UpdateUserRole);
userRouter.delete('/DeleteUserByAdmin/:_id', Auth_middleware_1.isAutheticated, (0, Auth_middleware_1.authorizeRoles)("admin"), user_controller_1.DeleteUser);
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map