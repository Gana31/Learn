import express from 'express';

import { authorizeRoles, isAutheticated } from '../middleware/Auth.middleware';

import {upload} from '../middleware/multer';
import { getEnrolledCourses } from '../controllers/TeacherCourse.controller';
import { ActivateRequest, DeleteUser, getAllUseres, getUserInfo, registerUser, SocialAuth, updateAcesssToken, UpdatePassword, updateUserAvatar, UpdateUserInfo, UpdateUserRole, userLogin, userLogout } from '../controllers/user.controller';



const userRouter = express.Router();

userRouter.post('/registerUser',registerUser);
userRouter.post('/activateUser',ActivateRequest);
userRouter.post('/loginUser',userLogin);
userRouter.get('/logoutUser',isAutheticated,userLogout);
userRouter.get('/refreshToken',updateAcesssToken);
userRouter.get('/UserInfo',isAutheticated,getUserInfo);
userRouter.get('/EnrolledCourses',isAutheticated,getEnrolledCourses);
userRouter.post('/SocialAuth',SocialAuth);
userRouter.put('/updateUser',isAutheticated,UpdateUserInfo);
userRouter.put('/updateUserPassword',isAutheticated,UpdatePassword);
userRouter.put('/UpadateUserAvatar',isAutheticated,upload.single('avatar'),updateUserAvatar);
userRouter.get('/GetAllUSerAdmin',isAutheticated,authorizeRoles("admin"),getAllUseres);
userRouter.put('/UpdateUserRoleByAdmin',isAutheticated,authorizeRoles("admin"),UpdateUserRole);
userRouter.delete('/DeleteUserByAdmin/:_id',isAutheticated,authorizeRoles("admin"),DeleteUser);


export default userRouter;