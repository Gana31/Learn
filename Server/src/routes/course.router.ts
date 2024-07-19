import express from 'express';

import { upload } from '../middleware/multer';
import { categoryPageDetailsteCourse, createCategory, createRating, showAllCategories, updateCourseProgress } from '../controllers/analytics.controller';
import { deleteCourse, editCourse, getAllCourses, getAllRating, getCourseDetails, getFullCourseDetails, getInstructorCourses, uploadTeacherCourse } from '../controllers/TeacherCourse.controller';
import { capturePayment, sendPaymentSuccessEmail, verifyPayment, } from '../controllers/Payment.controller';
import { authorizeRoles, isAutheticated } from '../middleware/Auth.middleware';
const courseRouter = express.Router();


courseRouter.post('/createCourse',isAutheticated,authorizeRoles("Instructor"),upload.single("thumbnailImage"),uploadTeacherCourse);
courseRouter.post('/editCourse',isAutheticated,authorizeRoles("Instructor"),upload.single("thumbnailImage"),editCourse);
courseRouter.post('/CreateCategory',isAutheticated,authorizeRoles("admin"),createCategory);
courseRouter.get('/GetAllCategory',showAllCategories);
courseRouter.get('/GetAllTeacherCourses',isAutheticated,authorizeRoles("Instructor"),getAllCourses);
courseRouter.get('/getInstructorCourses',isAutheticated,authorizeRoles("Instructor"),getInstructorCourses);
courseRouter.post('/getFullCourseDetails',isAutheticated,authorizeRoles("Instructor"),getFullCourseDetails);
courseRouter.post('/deleteCourse',isAutheticated,authorizeRoles("Instructor"),deleteCourse);
courseRouter.post("/getCategoryPageDetails", categoryPageDetailsteCourse)
courseRouter.post("/getCourseDetails", getCourseDetails)


courseRouter.post('/capturePayment', isAutheticated, authorizeRoles("Student"), capturePayment)
courseRouter.post('/verifyPayment',isAutheticated, authorizeRoles("Student"), verifyPayment)
courseRouter.post('/sendPaymentSuccessEmail', isAutheticated, authorizeRoles("Student"), sendPaymentSuccessEmail);
courseRouter.post('/createRating', isAutheticated, authorizeRoles("Student"), createRating);
courseRouter.post('/updateCourseProgress', isAutheticated, authorizeRoles("Student"), updateCourseProgress);
courseRouter.get('/getReviews',getAllRating)


export default courseRouter;